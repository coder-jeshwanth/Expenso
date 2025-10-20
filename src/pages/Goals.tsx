import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import GoalCard from '../components/GoalCard';
import { Goal } from '../types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const Goals: React.FC = () => {
  const { transactions, goals, addGoal, updateGoal, deleteGoal } = useTransactions();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    category: '',
    description: '',
    targetDate: undefined,
    completed: false,
  });

  const categories = ['Electronics', 'Travel', 'Car', 'Home', 'Education', 'Health', 'Other'];

  // Calculate monthly savings (average of last 3 months)
  const calculateMonthlySavings = () => {
    const now = new Date();
    const last3Months = [];
    
    for (let i = 0; i < 3; i++) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthlyIncome = transactions
        .filter(t => 
          t.type === 'credit' && 
          t.date >= monthStart && 
          t.date <= monthEnd
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyExpenses = transactions
        .filter(t => 
          t.type === 'debit' && 
          t.date >= monthStart && 
          t.date <= monthEnd
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      last3Months.push(monthlyIncome - monthlyExpenses);
    }
    
    return last3Months.length > 0 
      ? last3Months.reduce((sum, savings) => sum + savings, 0) / last3Months.length 
      : 0;
  };

  const monthlySavings = calculateMonthlySavings();
  
  // Calculate total goal progress
  const totalGoalAmount = goals.reduce((sum: number, goal: Goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum: number, goal: Goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter((goal: Goal) => goal.completed).length;

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      return;
    }

    const goalToAdd: Omit<Goal, 'id'> = {
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount || 0,
      category: newGoal.category || 'Other',
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      createdDate: new Date(),
      completed: false,
    };

    addGoal(goalToAdd);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      category: '',
      description: '',
      targetDate: undefined,
      completed: false,
    });
    setAddDialogOpen(false);
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    updateGoal(goalId, updates);
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Add Goal
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SavingsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Goals</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {goals.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedGoals} completed
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Target Amount</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ₹{totalGoalAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total target
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimelineIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">Saved Amount</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ₹{totalCurrentAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalGoalAmount > 0 ? ((totalCurrentAmount / totalGoalAmount) * 100).toFixed(1) : 0}% of target
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Monthly Savings</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ₹{monthlySavings > 0 ? monthlySavings.toLocaleString() : '0'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average last 3 months
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Savings Rate Alert */}
      {monthlySavings <= 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your current savings rate is low or negative. Consider reviewing your expenses to achieve your goals faster.
        </Alert>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No goals yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start by creating your first financial goal. Set targets for things you want to save for!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Create Your First Goal
          </Button>
        </Paper>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {goals.map((goal: Goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
              monthlySavings={monthlySavings}
            />
          ))}
        </Box>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add goal"
        onClick={() => setAddDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Goal Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Goal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Goal Name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              fullWidth
              required
              placeholder="e.g., New Laptop, Vacation, Emergency Fund"
            />
            <TextField
              label="Description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Describe what this goal is for..."
            />
            <TextField
              label="Target Amount (₹)"
              type="number"
              value={newGoal.targetAmount || ''}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
              fullWidth
              required
            />
            <TextField
              label="Current Amount (₹)"
              type="number"
              value={newGoal.currentAmount || ''}
              onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
              fullWidth
              placeholder="How much have you already saved?"
            />
            <TextField
              select
              label="Category"
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              fullWidth
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Target Date (Optional)"
              type="date"
              value={newGoal.targetDate ? format(new Date(newGoal.targetDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => setNewGoal({ 
                ...newGoal, 
                targetDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="When do you want to achieve this goal?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddGoal} 
            variant="contained" 
            disabled={!newGoal.name || !newGoal.targetAmount}
          >
            Create Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Goals;