import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'TeamFlow API', timestamp: new Date().toISOString() });
});

app.get('/api/dashboard', (_req, res) => {
  res.json({
    stats: [
      { label: 'Active Projects', value: '24', trend: '+12%' },
      { label: 'Open Tasks', value: '184', trend: '+5%' },
      { label: 'Velocity', value: '94%', trend: '+9%' },
      { label: 'Risk Alerts', value: '7', trend: '-2' },
    ],
    projects: [
      { id: 1, name: 'Platform Refresh', progress: 78, owner: 'Nia', due: 'Aug 16' },
      { id: 2, name: 'Mobile SDK', progress: 64, owner: 'Mateo', due: 'Sep 02' },
      { id: 3, name: 'RCA Workflow', progress: 91, owner: 'Iris', due: 'Jul 22' },
    ],
    activity: [
      { id: 1, user: 'Mina', action: 'completed review for onboarding flow', time: '5m ago' },
      { id: 2, user: 'Drew', action: 'assigned 3 subtasks in Platform Refresh', time: '18m ago' },
      { id: 3, user: 'Sage', action: 'created RCA report for API latency', time: '44m ago' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`TeamFlow API listening on port ${PORT}`);
});
