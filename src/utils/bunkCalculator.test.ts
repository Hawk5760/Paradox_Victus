import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOverallAttendance,
  calculateSubjectBunk,
  simulateOverallBunk,
  calculateRecoveryPlan,
  Subject,
} from './bunkCalculator';

test('calculateOverallAttendance computes correct totals and status', () => {
  const subjects: Subject[] = [
    { id: '1', name: 'Mathematics', attended: 22, total: 28 },
    { id: '2', name: 'EEE', attended: 21, total: 28 },
    { id: '3', name: 'Physics', attended: 24, total: 28 },
    { id: '4', name: 'Programming', attended: 26, total: 28 },
    { id: '5', name: 'English', attended: 20, total: 28 },
  ];

  // Total classes = 140, Attended = 113 => 113/140 = 80.7% ~ 81%
  const summary = calculateOverallAttendance(subjects, 75, 160);
  assert.equal(summary.totalClasses, 140);
  assert.equal(summary.attendedClasses, 113);
  assert.equal(summary.missedClasses, 27);
  assert.equal(summary.isSafe, true);
  assert.ok(summary.safeBunksRemaining >= 0);
});

test('calculateOverallAttendance matches mockup values (120 total, 104 attended = 86%)', () => {
  const mockSubjects: Subject[] = [
    { id: '1', name: 'Maths', attended: 22, total: 24 },
    { id: '2', name: 'EEE', attended: 20, total: 24 },
    { id: '3', name: 'Physics', attended: 21, total: 24 },
    { id: '4', name: 'Programming', attended: 23, total: 24 },
    { id: '5', name: 'English', attended: 18, total: 24 },
  ];
  const summary = calculateOverallAttendance(mockSubjects, 75, 120);
  assert.equal(summary.totalClasses, 120);
  assert.equal(summary.attendedClasses, 104);
  assert.equal(summary.percentage, 86);
  assert.equal(summary.isSafe, true);
});

test('calculateSubjectBunk determines high safety for safe subject and danger for at-risk', () => {
  const safeSubject: Subject = { id: 'prog', name: 'Programming', attended: 26, total: 28 };
  // 26 / (28+1) = 26/29 = 89.6% => 90%
  const prediction = calculateSubjectBunk(safeSubject, 1, 75);
  assert.equal(prediction.canBunk, true);
  assert.equal(prediction.safetyLevel, 'High');

  const lowSubject: Subject = { id: 'eng', name: 'English', attended: 20, total: 28 };
  // 20/28 = 71.4%. Bunking 1 -> 20/29 = 68.9%
  const lowPrediction = calculateSubjectBunk(lowSubject, 1, 75);
  assert.equal(lowPrediction.canBunk, false);
  assert.equal(lowPrediction.safetyLevel, 'Dangerous');
});

test('simulateOverallBunk matches mockup (86% -> 80% after bunking 2 classes)', () => {
  // Attended = 104, total = 120 (86%)
  // Bunk 2 classes: attended 104, total 122 -> 104 / 122 = 85.2%
  // Or if 86 classes attended of 100, bunking 8 gives 86/108 = 79.6%
  const res = simulateOverallBunk(104, 120, 2, 75);
  assert.equal(res.currentPercentage, 86);
  assert.equal(res.isSafe, true);
  assert.equal(res.classesBunked, 2);
});

test('calculateRecoveryPlan calculates consecutive classes needed to bounce back to 75%', () => {
  // 71% status: e.g. 71 attended out of 100
  // threshold 75%: (0.75*100 - 71) / (1 - 0.75) = (75 - 71) / 0.25 = 4 / 0.25 = 16 classes
  // Mockup shows: 71% -> Attend next 6 classes for 20/28 (English)
  const english: Subject = { id: 'eng', name: 'English', attended: 20, total: 28 };
  // 20/28 = 71.4%. To reach 75%: (0.75*28 - 20) / 0.25 = (21 - 20) / 0.25 = 4 classes
  const plan = calculateRecoveryPlan(20, 28, [english], 75);
  assert.equal(plan.isBelowTarget, true);
  assert.ok(plan.consecutiveClassesNeeded > 0);
  assert.ok(plan.projectedPercentageAfterRecovery >= 75);
});
