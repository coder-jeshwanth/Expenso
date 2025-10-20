import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { format, differenceInDays, isBefore, isAfter } from 'date-fns';
import { Goal } from '../types';
import { useTransactions } from '../context/TransactionContext';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
  onDelete: (goalId: string) => void;
  monthlySavings: number;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate, onDelete, monthlySavings }) => {
  const { getCurrentBalance } = useTransactions();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Partial<Goal>>(goal);

  const categories = ['Electronics', 'Travel', 'Car', 'Home', 'Education', 'Health', 'Other'];

  // Calculate progress
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  
  // Calculate days to achieve goal based on monthly savings
  const daysToAchieve = monthlySavings > 0 ? Math.ceil((remainingAmount / monthlySavings) * 30) : 0;
  
  // Calculate if goal can be achieved by target date
  const canAchieveByTargetDate = goal.targetDate 
    ? differenceInDays(goal.targetDate, new Date()) >= daysToAchieve
    : true;

  // Update timer
  useEffect(() => {
    const updateTimer = () => {
      if (goal.targetDate) {
        const now = new Date();
        const target = new Date(goal.targetDate);
        
        if (isBefore(target, now)) {
          setTimeLeft('Overdue');
        } else {
          const days = differenceInDays(target, now);
          const hours = Math.floor((target.getTime() - now.getTime()) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          const minutes = Math.floor((target.getTime() - now.getTime()) % (1000 * 60 * 60) / (1000 * 60));
          
          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
          } else {
            setTimeLeft(`${hours}h ${minutes}m`);
          }
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [goal.targetDate]);

  const handleUpdate = () => {
    onUpdate(goal.id, editedGoal);
    setEditOpen(false);
  };

  const handleDelete = () => {
    onDelete(goal.id);
    setDeleteOpen(false);
  };

  const getStatusColor = () => {
    if (goal.completed) return 'success';
    if (goal.targetDate && isBefore(new Date(goal.targetDate), new Date())) return 'error';
    if (!canAchieveByTargetDate) return 'warning';
    return 'primary';
  };

  const getStatusText = () => {
    if (goal.completed) return 'Completed';
    if (goal.targetDate && isBefore(new Date(goal.targetDate), new Date())) return 'Overdue';
    if (!canAchieveByTargetDate) return 'At Risk';
    return 'On Track';
  };

  return (
    <>
      <Card sx={{ height: '100%', position: 'relative' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flex: 1 }}>
              {goal.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => setEditOpen(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setDeleteOpen(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Chip 
            label={getStatusText()} 
            color={getStatusColor()} 
            size="small" 
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {goal.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {progress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
              color={getStatusColor()}
            />
          </Box>

          {goal.targetDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          )}

          {timeLeft && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2" color={timeLeft === 'Overdue' ? 'error' : 'text.primary'}>
                {timeLeft === 'Overdue' ? 'Overdue' : `Time left: ${timeLeft}`}
              </Typography>
            </Box>
          )}

          {!goal.completed && monthlySavings > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Can achieve in {daysToAchieve} days at current savings rate
              </Typography>
            </Box>
          )}

          {!goal.completed && remainingAmount > 0 && (
            <Typography variant="body2" color="text.secondary">
              ₹{remainingAmount.toLocaleString()} remaining
            </Typography>
          )}

          {!canAchieveByTargetDate && !goal.completed && goal.targetDate && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              At current savings rate, you may not achieve this goal by the target date.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Goal Name"
              value={editedGoal.name || ''}
              onChange={(e) => setEditedGoal({ ...editedGoal, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editedGoal.description || ''}
              onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Target Amount"
              type="number"
              value={editedGoal.targetAmount || ''}
              onChange={(e) => setEditedGoal({ ...editedGoal, targetAmount: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Current Amount"
              type="number"
              value={editedGoal.currentAmount || ''}
              onChange={(e) => setEditedGoal({ ...editedGoal, currentAmount: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={editedGoal.category || ''}
              onChange={(e) => setEditedGoal({ ...editedGoal, category: e.target.value })}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Target Date"
              type="date"
              value={editedGoal.targetDate ? format(new Date(editedGoal.targetDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => setEditedGoal({ 
                ...editedGoal, 
                targetDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Goal</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{goal.name}"? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoalCard;