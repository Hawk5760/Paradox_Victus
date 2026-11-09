export interface Subject {
  id: string;
  name: string;
  code?: string;
  attended: number;
  total: number;
  room?: string;
  professor?: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  remainingClasses: number;
  percentage: number;
  isSafe: boolean;
  status: 'Safe' | 'Borderline' | 'At Risk' | 'Great';
  safeBunksRemaining: number;
}

export interface BunkPrediction {
  currentPercentage: number;
  projectedPercentage: number;
  safetyLevel: 'High' | 'Medium' | 'Low' | 'Dangerous';
  isSafe: boolean;
  canBunk: boolean;
  message: string;
}

export interface SimulationResult {
  currentPercentage: number;
  projectedPercentage: number;
  classesBunked: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  isSafe: boolean;
  difference: number;
}

export interface RecoveryPlan {
  currentPercentage: number;
  targetThreshold: number;
  consecutiveClassesNeeded: number;
  isBelowTarget: boolean;
  projectedPercentageAfterRecovery: number;
  suggestedFocusSubjects: string[];
}

/**
 * Calculates overall attendance summary across all subjects
 */
export function calculateOverallAttendance(
  subjects: Subject[],
  targetThreshold: number = 75,
  semesterTotalEstimate: number = 120
): AttendanceSummary {
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const attendedClasses = subjects.reduce((sum, s) => sum + s.attended, 0);
  const missedClasses = totalClasses - attendedClasses;
  const remainingClasses = Math.max(0, semesterTotalEstimate - attendedClasses);
  const percentage = totalClasses > 0 ? Math.floor((attendedClasses / totalClasses) * 100) : 0;

  // Max classes a student can bunk without falling below targetThreshold:
  // (attended) / (total + x) >= targetThreshold / 100
  // attended >= targetThreshold/100 * total + targetThreshold/100 * x
  // x <= (attended - targetThreshold/100 * total) / (targetThreshold/100)
  const thresholdRatio = targetThreshold / 100;
  const safeBunksRemaining = Math.max(
    0,
    Math.floor((attendedClasses - thresholdRatio * totalClasses) / thresholdRatio)
  );

  let status: 'Safe' | 'Borderline' | 'At Risk' | 'Great' = 'Safe';
  if (percentage >= 90) {
    status = 'Great';
  } else if (percentage >= targetThreshold + 5) {
    status = 'Safe';
  } else if (percentage >= targetThreshold) {
    status = 'Borderline';
  } else {
    status = 'At Risk';
  }

  return {
    totalClasses,
    attendedClasses,
    missedClasses,
    remainingClasses,
    percentage,
    isSafe: percentage >= targetThreshold,
    status,
    safeBunksRemaining,
  };
}

/**
 * Calculates the safety and projected attendance if bunking classes for a specific subject
 */
export function calculateSubjectBunk(
  subject: Subject,
  bunksCount: number = 1,
  targetThreshold: number = 75
): BunkPrediction {
  const currentPct = subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0;
  const newTotal = subject.total + bunksCount;
  const newAttended = subject.attended;
  const projectedPct = Math.round((newAttended / newTotal) * 100);

  const canBunk = projectedPct >= targetThreshold;
  let safetyLevel: 'High' | 'Medium' | 'Low' | 'Dangerous' = 'Low';
  let message = '';

  if (projectedPct >= 80) {
    safetyLevel = 'High';
    message = `You can bunk this class! Your attendance will still stay above ${targetThreshold}%.`;
  } else if (projectedPct >= targetThreshold) {
    safetyLevel = 'Medium';
    message = `Borderline safe! Attendance drops to ${projectedPct}%, right at your ${targetThreshold}% limit.`;
  } else if (projectedPct >= targetThreshold - 5) {
    safetyLevel = 'Low';
    message = `Risky move! Attendance will fall below ${targetThreshold}%. Dubey Sir might call your parents!`;
  } else {
    safetyLevel = 'Dangerous';
    message = `DANGER! Critical attendance shortage (${projectedPct}%). Bunking is NOT recommended!`;
  }

  return {
    currentPercentage: currentPct,
    projectedPercentage: projectedPct,
    safetyLevel,
    isSafe: canBunk,
    canBunk,
    message,
  };
}

/**
 * What-if simulator for bunking N overall classes
 */
export function simulateOverallBunk(
  attended: number,
  total: number,
  bunksToTake: number,
  targetThreshold: number = 75
): SimulationResult {
  const currentPercentage = total > 0 ? Math.floor((attended / total) * 100) : 0;
  const projectedTotal = total + bunksToTake;
  const projectedPercentage = projectedTotal > 0 ? Math.floor((attended / projectedTotal) * 100) : 0;
  const difference = currentPercentage - projectedPercentage;

  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (projectedPercentage >= 80) {
    riskLevel = 'Low';
  } else if (projectedPercentage >= targetThreshold) {
    riskLevel = 'Medium';
  } else if (projectedPercentage >= targetThreshold - 5) {
    riskLevel = 'High';
  } else {
    riskLevel = 'Critical';
  }

  return {
    currentPercentage,
    projectedPercentage,
    classesBunked: bunksToTake,
    riskLevel,
    isSafe: projectedPercentage >= targetThreshold,
    difference,
  };
}

/**
 * Calculates recovery plan if attendance is below or near threshold
 */
export function calculateRecoveryPlan(
  attended: number,
  total: number,
  subjects: Subject[],
  targetThreshold: number = 75
): RecoveryPlan {
  const currentPct = total > 0 ? Math.round((attended / total) * 100) : 0;
  const thresholdRatio = targetThreshold / 100;

  // Formula for consecutive attended classes N needed to reach threshold:
  // (attended + N) / (total + N) >= T
  // attended + N >= T*total + T*N
  // N*(1 - T) >= T*total - attended
  // N >= (T*total - attended) / (1 - T)
  let needed = 0;
  if (currentPct < targetThreshold) {
    needed = Math.max(1, Math.ceil((thresholdRatio * total - attended) / (1 - thresholdRatio)));
  }

  const projectedTotal = total + needed;
  const projectedAttended = attended + needed;
  const projectedPct = projectedTotal > 0 ? Math.round((projectedAttended / projectedTotal) * 100) : targetThreshold;

  const atRiskSubjects = subjects
    .filter((s) => (s.attended / s.total) * 100 < targetThreshold)
    .map((s) => s.name);

  return {
    currentPercentage: currentPct,
    targetThreshold,
    consecutiveClassesNeeded: needed,
    isBelowTarget: currentPct < targetThreshold,
    projectedPercentageAfterRecovery: projectedPct,
    suggestedFocusSubjects: atRiskSubjects.length > 0 ? atRiskSubjects : ['EEE', 'English'],
  };
}
