import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to durable persistent database file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing utility using crypto
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_euphoria_salt_2026').digest('hex');
}

export interface TeamMember {
  id: string;
  name: string;
  registerNumber: string;
  collegeName: string;
  phoneNumber: string;
  department: string;
  academicYear: string;
  attendance: 'Present' | 'Absent';
}

export interface Team {
  id: string;
  teamNumber: string;
  teamName: string;
  assignedJudge: string;
  technicalQuizScore: number | null;
  iotSimulationScore: number | null;
  totalScore: number | null;
  rank: number | null;
  evaluationStatus: 'Not Evaluated' | 'Evaluated';
  evaluatedAt?: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

export interface DatabaseSchema {
  users: Array<{
    id: string;
    username: string;
    passwordHash: string;
    role: 'admin' | 'judge';
    createdAt: string;
  }>;
  tokens: Record<string, { username: string; role: 'admin' | 'judge'; expiresAt: number }>;
  settings: {
    college: string;
    autonomous: string;
    managedBy: string;
    affiliatedTo: string;
    department: string;
    organizedBy: string;
    eventName: string;
    technicalEvent: string;
    date: string;
    time: string;
    venue: string;
    eventStatus: 'Registration Open' | 'Registration Closed' | 'Event Started' | 'Evaluation Started' | 'Evaluation Completed' | 'Results Published';
    round1Name: string;
    round1Max: number;
    round2Name: string;
    round2Max: number;
    totalMax: number;
    tieBreakerRule: string;
  };
  teams: Team[];
}

// Default initial data
function getInitialData(): DatabaseSchema {
  const adminPasswordHash = hashPassword('admin@123');
  const judgePasswordHash = hashPassword('judge@123');
  const now = new Date().toISOString();

  return {
    users: [
      {
        id: 'usr_admin',
        username: 'Admin',
        passwordHash: adminPasswordHash,
        role: 'admin',
        createdAt: now,
      },
      {
        id: 'usr_judge',
        username: 'Judge',
        passwordHash: judgePasswordHash,
        role: 'judge',
        createdAt: now,
      },
    ],
    tokens: {},
    settings: {
      college: 'MEENAKSHI SUNDARAJAN ENGINEERING COLLEGE',
      autonomous: 'Autonomous',
      managedBy: 'I.I.E.T. Society',
      affiliatedTo: 'Anna University',
      department: 'Department of Civil Engineering',
      organizedBy: 'Eco Design Club',
      eventName: "Euphoria'26",
      technicalEvent: 'IoT Based Smart Cities Challenge',
      date: '25/09/2026 – Friday',
      time: '10:00 AM – 12:00 PM',
      venue: 'MSEC Civil Block',
      eventStatus: 'Event Started',
      round1Name: 'Technical Quiz',
      round1Max: 50,
      round2Name: 'IoT Based Simulation',
      round2Max: 50,
      totalMax: 100,
      tieBreakerRule: '1. IoT Based Simulation Score → 2. Technical Quiz Score → 3. Admin Manual Resolution',
    },
    teams: [
      {
        id: 'team_01',
        teamNumber: '01',
        teamName: 'EcoPulse Smart Grid',
        assignedJudge: 'Judge',
        technicalQuizScore: 46,
        iotSimulationScore: 48,
        totalScore: 94,
        rank: 1,
        evaluationStatus: 'Evaluated',
        evaluatedAt: now,
        createdAt: now,
        updatedAt: now,
        members: [
          {
            id: 'mem_01_1',
            name: 'Kavitha Ramasamy',
            registerNumber: '311522103012',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840123456',
            department: 'Civil Engineering',
            academicYear: 'Final Year (IV)',
            attendance: 'Present',
          },
          {
            id: 'mem_01_2',
            name: 'Arjun Swaminathan',
            registerNumber: '311522103008',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840123457',
            department: 'Civil Engineering',
            academicYear: 'Third Year (III)',
            attendance: 'Present',
          },
        ],
      },
      {
        id: 'team_02',
        teamNumber: '02',
        teamName: 'Urban Flow Dynamics',
        assignedJudge: 'Judge',
        technicalQuizScore: 44,
        iotSimulationScore: 47,
        totalScore: 91,
        rank: 2,
        evaluationStatus: 'Evaluated',
        evaluatedAt: now,
        createdAt: now,
        updatedAt: now,
        members: [
          {
            id: 'mem_02_1',
            name: 'Rohit Chandran',
            registerNumber: '311522103045',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840234567',
            department: 'Civil Engineering',
            academicYear: 'Final Year (IV)',
            attendance: 'Present',
          },
          {
            id: 'mem_02_2',
            name: 'Divya Bharathi',
            registerNumber: '311522103019',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840234568',
            department: 'Civil Engineering',
            academicYear: 'Third Year (III)',
            attendance: 'Present',
          },
        ],
      },
      {
        id: 'team_03',
        teamNumber: '03',
        teamName: 'AquaSense Drainage IoT',
        assignedJudge: 'Judge',
        technicalQuizScore: 42,
        iotSimulationScore: 45,
        totalScore: 87,
        rank: 3,
        evaluationStatus: 'Evaluated',
        evaluatedAt: now,
        createdAt: now,
        updatedAt: now,
        members: [
          {
            id: 'mem_03_1',
            name: 'Manoj Kumar V',
            registerNumber: '311522103031',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840345678',
            department: 'Civil Engineering',
            academicYear: 'Final Year (IV)',
            attendance: 'Present',
          },
          {
            id: 'mem_03_2',
            name: 'Sneha Murali',
            registerNumber: '311522103052',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840345679',
            department: 'Civil Engineering',
            academicYear: 'Third Year (III)',
            attendance: 'Present',
          },
        ],
      },
      {
        id: 'team_04',
        teamNumber: '04',
        teamName: 'TerraCarbon Analytics',
        assignedJudge: 'Judge',
        technicalQuizScore: 39,
        iotSimulationScore: 42,
        totalScore: 81,
        rank: 4,
        evaluationStatus: 'Evaluated',
        evaluatedAt: now,
        createdAt: now,
        updatedAt: now,
        members: [
          {
            id: 'mem_04_1',
            name: 'Praveen Balaji',
            registerNumber: '311522103040',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840456789',
            department: 'Civil Engineering',
            academicYear: 'Third Year (III)',
            attendance: 'Present',
          },
          {
            id: 'mem_04_2',
            name: 'Ananya Sridhar',
            registerNumber: '311522103005',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840456790',
            department: 'Civil Engineering',
            academicYear: 'Second Year (II)',
            attendance: 'Present',
          },
        ],
      },
      {
        id: 'team_05',
        teamNumber: '05',
        teamName: 'AeroClean Microclimate',
        assignedJudge: 'Judge',
        technicalQuizScore: null,
        iotSimulationScore: null,
        totalScore: null,
        rank: null,
        evaluationStatus: 'Not Evaluated',
        createdAt: now,
        updatedAt: now,
        members: [
          {
            id: 'mem_05_1',
            name: 'Vigneshwaran K',
            registerNumber: '311522103061',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840567890',
            department: 'Civil Engineering',
            academicYear: 'Final Year (IV)',
            attendance: 'Present',
          },
          {
            id: 'mem_05_2',
            name: 'Harini S',
            registerNumber: '311522103023',
            collegeName: 'Meenakshi Sundarajan Engineering College',
            phoneNumber: '9840567891',
            department: 'Civil Engineering',
            academicYear: 'Third Year (III)',
            attendance: 'Absent',
          },
        ],
      },
    ],
  };
}

// Database helper functions
function readDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return data;
  } catch (err) {
    console.error('Failed reading db.json, resetting to initial state', err);
    const initial = getInitialData();
    writeDb(initial);
    return initial;
  }
}

function writeDb(data: DatabaseSchema) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Recalculate automatic rankings with strict tie-breaking logic
function recalculateRankings(teams: Team[]): Team[] {
  const evaluated = teams.filter((t) => t.evaluationStatus === 'Evaluated' && t.totalScore !== null);
  const notEvaluated = teams.filter((t) => t.evaluationStatus !== 'Evaluated' || t.totalScore === null);

  // Tie-breaking:
  // 1. Total Score (DESC)
  // 2. IoT Simulation Score (DESC)
  // 3. Technical Quiz Score (DESC)
  // 4. Team Number (ASC)
  evaluated.sort((a, b) => {
    const totalA = a.totalScore ?? 0;
    const totalB = b.totalScore ?? 0;
    if (totalB !== totalA) return totalB - totalA;

    const iotA = a.iotSimulationScore ?? 0;
    const iotB = b.iotSimulationScore ?? 0;
    if (iotB !== iotA) return iotB - iotA;

    const quizA = a.technicalQuizScore ?? 0;
    const quizB = b.technicalQuizScore ?? 0;
    if (quizB !== quizA) return quizB - quizA;

    return a.teamNumber.localeCompare(b.teamNumber);
  });

  evaluated.forEach((team, idx) => {
    team.rank = idx + 1;
  });

  notEvaluated.forEach((team) => {
    team.rank = null;
  });

  return [...evaluated, ...notEvaluated];
}

// Authentication middleware
export interface AuthRequest extends Request {
  user?: {
    username: string;
    role: 'admin' | 'judge';
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const db = readDb();
  const session = db.tokens[token];

  if (!session || session.expiresAt < Date.now()) {
    return res.status(403).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  req.user = {
    username: session.username,
    role: session.role,
  };
  next();
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
  next();
}

function requireJudge(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'judge') {
    return res.status(403).json({ error: 'Access denied: Judge privileges required' });
  }
  next();
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password, portalType } = req.body;

  if (!username || !password || !portalType) {
    return res.status(400).json({ error: 'Username, password and portalType are required' });
  }

  const db = readDb();
  const targetUser = db.users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.role === portalType
  );

  if (!targetUser) {
    return res.status(401).json({ error: 'Invalid credentials or unauthorized portal access' });
  }

  const inputHash = hashPassword(password);
  if (inputHash !== targetUser.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate session token valid for 24 hours
  const token = 'tok_' + crypto.randomBytes(24).toString('hex');
  db.tokens[token] = {
    username: targetUser.username,
    role: targetUser.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  writeDb(db);

  return res.json({
    token,
    username: targetUser.username,
    role: targetUser.role,
  });
});

// Auth: Verify token
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  const db = readDb();
  const session = db.tokens[token];

  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ valid: false });
  }

  return res.json({
    valid: true,
    username: session.username,
    role: session.role,
  });
});

// Auth: Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const db = readDb();
    delete db.tokens[token];
    writeDb(db);
  }
  return res.json({ success: true });
});

// ----------------------------------------------------
// PUBLIC ROUTES (Strictly Privacy-Preserving)
// ----------------------------------------------------

// Public Event Settings
app.get('/api/public/event-settings', (req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.settings);
});

// Public Live Scoreboard (No personal identifiers like phone or register numbers)
app.get('/api/public/scoreboard', (req: Request, res: Response) => {
  const db = readDb();
  const sorted = [...db.teams].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank) return -1;
    if (b.rank) return 1;
    return a.teamNumber.localeCompare(b.teamNumber);
  });

  const publicData = sorted.map((t) => ({
    rank: t.rank,
    teamNumber: t.teamNumber,
    teamName: t.teamName,
    totalScore: t.totalScore,
    evaluationStatus: t.evaluationStatus,
  }));

  return res.json(publicData);
});

// Public Rankings
app.get('/api/public/rankings', (req: Request, res: Response) => {
  const db = readDb();
  const ranked = db.teams
    .filter((t) => t.evaluationStatus === 'Evaluated' && t.totalScore !== null)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    .map((t) => ({
      rank: t.rank,
      teamNumber: t.teamNumber,
      teamName: t.teamName,
      technicalQuizScore: t.technicalQuizScore,
      iotSimulationScore: t.iotSimulationScore,
      totalScore: t.totalScore,
      evaluationStatus: t.evaluationStatus,
    }));

  return res.json(ranked);
});

// Public Winners (Top 3)
app.get('/api/public/winners', (req: Request, res: Response) => {
  const db = readDb();
  const top3 = db.teams
    .filter((t) => t.evaluationStatus === 'Evaluated' && t.totalScore !== null && t.rank !== null && t.rank <= 3)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    .map((t) => ({
      rank: t.rank,
      teamNumber: t.teamNumber,
      teamName: t.teamName,
      totalScore: t.totalScore,
      technicalQuizScore: t.technicalQuizScore,
      iotSimulationScore: t.iotSimulationScore,
      members: t.members.map((m) => ({ name: m.name, collegeName: m.collegeName })),
    }));

  return res.json(top3);
});

// ----------------------------------------------------
// ADMIN ROUTES (Protected)
// ----------------------------------------------------

// Admin: Get all teams with complete data
app.get('/api/admin/teams', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const db = readDb();
  return res.json(db.teams);
});

// Admin: Add a new team (Permanent storage, checks unique teamNumber)
app.post('/api/admin/teams', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { teamNumber, teamName, members, assignedJudge } = req.body;

  if (!teamNumber || !teamName) {
    return res.status(400).json({ error: 'Team Number and Team Name are required' });
  }

  const db = readDb();

  // Check unique team number
  const existing = db.teams.find((t) => t.teamNumber.trim() === String(teamNumber).trim());
  if (existing) {
    return res.status(400).json({ error: `Team Number "${teamNumber}" is already registered` });
  }

  const now = new Date().toISOString();
  const teamId = 'team_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  const formattedMembers: TeamMember[] = Array.isArray(members)
    ? members.map((m: any, idx: number) => ({
        id: m.id || `mem_${teamId}_${idx + 1}`,
        name: m.name || '',
        registerNumber: m.registerNumber || '',
        collegeName: m.collegeName || 'Meenakshi Sundarajan Engineering College',
        phoneNumber: m.phoneNumber || '',
        department: m.department || 'Civil Engineering',
        academicYear: m.academicYear || 'Third Year (III)',
        attendance: m.attendance || 'Absent',
      }))
    : [];

  const newTeam: Team = {
    id: teamId,
    teamNumber: String(teamNumber).trim(),
    teamName: String(teamName).trim(),
    assignedJudge: assignedJudge || 'Judge',
    technicalQuizScore: null,
    iotSimulationScore: null,
    totalScore: null,
    rank: null,
    evaluationStatus: 'Not Evaluated',
    createdAt: now,
    updatedAt: now,
    members: formattedMembers,
  };

  db.teams.push(newTeam);
  db.teams = recalculateRankings(db.teams);
  writeDb(db);

  return res.status(201).json(newTeam);
});

// Admin: Update team details
app.put('/api/admin/teams/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { teamNumber, teamName, members, assignedJudge } = req.body;

  const db = readDb();
  const teamIndex = db.teams.findIndex((t) => t.id === id);

  if (teamIndex === -1) {
    return res.status(404).json({ error: 'Team not found' });
  }

  if (teamNumber) {
    const duplicate = db.teams.find((t) => t.id !== id && t.teamNumber.trim() === String(teamNumber).trim());
    if (duplicate) {
      return res.status(400).json({ error: `Team Number "${teamNumber}" already taken by another team` });
    }
    db.teams[teamIndex].teamNumber = String(teamNumber).trim();
  }

  if (teamName) db.teams[teamIndex].teamName = String(teamName).trim();
  if (assignedJudge !== undefined) db.teams[teamIndex].assignedJudge = assignedJudge;

  if (Array.isArray(members)) {
    db.teams[teamIndex].members = members.map((m: any, idx: number) => ({
      id: m.id || `mem_${id}_${idx + 1}`,
      name: m.name || '',
      registerNumber: m.registerNumber || '',
      collegeName: m.collegeName || '',
      phoneNumber: m.phoneNumber || '',
      department: m.department || '',
      academicYear: m.academicYear || '',
      attendance: m.attendance || 'Absent',
    }));
  }

  db.teams[teamIndex].updatedAt = new Date().toISOString();
  db.teams = recalculateRankings(db.teams);
  writeDb(db);

  return res.json(db.teams[teamIndex]);
});

// Admin: Delete a team permanently with verification
app.delete('/api/admin/teams/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = readDb();

  const teamIndex = db.teams.findIndex((t) => t.id === id);
  if (teamIndex === -1) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const deletedTeam = db.teams.splice(teamIndex, 1)[0];
  db.teams = recalculateRankings(db.teams);
  writeDb(db);

  return res.json({ success: true, message: `Team ${deletedTeam.teamNumber} permanently deleted` });
});

// Admin: Assign Judge to Team
app.put('/api/admin/teams/:id/assign-judge', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { assignedJudge } = req.body;

  if (!assignedJudge) {
    return res.status(400).json({ error: 'Assigned Judge is required' });
  }

  const db = readDb();
  const team = db.teams.find((t) => t.id === id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  team.assignedJudge = assignedJudge;
  team.updatedAt = new Date().toISOString();
  writeDb(db);

  return res.json(team);
});

// Admin: Update Attendance for Team Members
app.put('/api/admin/teams/:id/attendance', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { memberAttendance } = req.body; // Array of { memberId, attendance: 'Present' | 'Absent' }

  if (!Array.isArray(memberAttendance)) {
    return res.status(400).json({ error: 'memberAttendance must be an array' });
  }

  const db = readDb();
  const team = db.teams.find((t) => t.id === id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  memberAttendance.forEach((item: { memberId: string; attendance: 'Present' | 'Absent' }) => {
    const mem = team.members.find((m) => m.id === item.memberId);
    if (mem && (item.attendance === 'Present' || item.attendance === 'Absent')) {
      mem.attendance = item.attendance;
    }
  });

  team.updatedAt = new Date().toISOString();
  writeDb(db);

  return res.json(team);
});

// Admin: Change Judge Password
app.put('/api/admin/judge-password', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { judgeUsername = 'Judge', newPassword } = req.body;

  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters' });
  }

  const db = readDb();
  const judge = db.users.find((u) => u.username.toLowerCase() === judgeUsername.toLowerCase() && u.role === 'judge');

  if (!judge) {
    return res.status(404).json({ error: `Judge account "${judgeUsername}" not found` });
  }

  judge.passwordHash = hashPassword(newPassword.trim());
  writeDb(db);

  return res.json({ success: true, message: `Password for ${judge.username} updated successfully` });
});

// Admin: Update Event Settings / Status
app.put('/api/admin/event-settings', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const updates = req.body;

  db.settings = {
    ...db.settings,
    ...updates,
  };
  writeDb(db);

  return res.json(db.settings);
});

// Admin: Stats overview
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const totalTeams = db.teams.length;
  let totalParticipants = 0;
  let presentCount = 0;
  let absentCount = 0;

  db.teams.forEach((t) => {
    t.members.forEach((m) => {
      totalParticipants++;
      if (m.attendance === 'Present') presentCount++;
      else absentCount++;
    });
  });

  const evaluatedTeams = db.teams.filter((t) => t.evaluationStatus === 'Evaluated').length;
  const pendingTeams = totalTeams - evaluatedTeams;
  const attendancePercentage = totalParticipants > 0 ? Math.round((presentCount / totalParticipants) * 100) : 0;

  return res.json({
    totalTeams,
    totalParticipants,
    presentCount,
    absentCount,
    attendancePercentage,
    evaluatedTeams,
    pendingTeams,
    eventStatus: db.settings.eventStatus,
  });
});

// ----------------------------------------------------
// JUDGE ROUTES (Protected)
// ----------------------------------------------------

// Judge: Get assigned teams ONLY
app.get('/api/judge/my-teams', authenticateToken, requireJudge, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const judgeUsername = req.user!.username;

  // Judge can ONLY see teams assigned to them
  const myTeams = db.teams.filter(
    (t) => t.assignedJudge && t.assignedJudge.toLowerCase() === judgeUsername.toLowerCase()
  );

  return res.json(myTeams);
});

// Judge: Evaluate BOTH rounds for assigned team
app.put('/api/judge/teams/:id/evaluate', authenticateToken, requireJudge, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { technicalQuizScore, iotSimulationScore } = req.body;

  const quiz = Number(technicalQuizScore);
  const iot = Number(iotSimulationScore);

  // Strict score validations:
  // Both rounds required, 0 to 50 each, no negatives, no > 50
  if (isNaN(quiz) || quiz < 0 || quiz > 50) {
    return res.status(400).json({ error: 'Technical Quiz Score must be between 0 and 50 marks' });
  }

  if (isNaN(iot) || iot < 0 || iot > 50) {
    return res.status(400).json({ error: 'IoT Based Simulation Score must be between 0 and 50 marks' });
  }

  const db = readDb();
  const team = db.teams.find((t) => t.id === id);

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  // Ensure team is assigned to this judge
  if (team.assignedJudge.toLowerCase() !== req.user!.username.toLowerCase()) {
    return res.status(403).json({ error: 'You are not authorized to evaluate this team' });
  }

  const total = quiz + iot;

  team.technicalQuizScore = quiz;
  team.iotSimulationScore = iot;
  team.totalScore = total;
  team.evaluationStatus = 'Evaluated';
  team.evaluatedAt = new Date().toISOString();
  team.updatedAt = new Date().toISOString();

  db.teams = recalculateRankings(db.teams);
  writeDb(db);

  return res.json(team);
});

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Euphoria'26 Event Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
