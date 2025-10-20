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
      <Card 
        sx={{ 
          height: '100%', 
          position: 'relative',
          background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold', 
                flex: 1, 
                color: 'white',
                fontSize: '1.1rem'
              }}
            >
              {goal.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => setEditOpen(true)}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': { 
                    color: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setDeleteOpen(true)}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': { 
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Chip 
            label={getStatusText()} 
            color={getStatusColor()} 
            size="small" 
            sx={{ 
              mb: 2,
              fontWeight: '500',
              fontSize: '0.75rem',
              borderRadius: 2
            }}
          />

          {goal.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.5
              }}
            >
              {goal.description}
            </Typography>
          )}

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: progress >= 100 ? '#10b981' : '#3b82f6'
                }}
              >
                {progress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  background: progress >= 100 
                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)'
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {goal.targetDate && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 1.5,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <TimeIcon fontSize="small" sx={{ mr: 1.5, color: '#3b82f6' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
                    Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                  </Typography>
                  {timeLeft && (
                    <Typography variant="caption" sx={{ 
                      color: timeLeft === 'Overdue' ? '#ef4444' : '#3b82f6',
                      fontWeight: '500'
                    }}>
                      {timeLeft === 'Overdue' ? '⚠️ Overdue' : `⏰ ${timeLeft}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {!goal.completed && monthlySavings > 0 && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 1.5,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <TrendingUpIcon fontSize="small" sx={{ mr: 1.5, color: '#10b981' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
                    Achievable in {daysToAchieve} days
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10b981' }}>
                    At current savings rate
                  </Typography>
                </Box>
              </Box>
            )}

            {!goal.completed && remainingAmount > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Remaining
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  ₹{remainingAmount.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>

          {!canAchieveByTargetDate && !goal.completed && goal.targetDate && (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 2,
                '& .MuiAlert-message': {
                  color: 'rgba(255, 255, 255, 0.9)'
                },
                '& .MuiAlert-icon': {
                  color: '#f59e0b'
                }
              }}
            >
              At current savings rate, you may not achieve this goal by the target date.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 1,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          Edit Goal
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Goal Name
              </Typography>
              <TextField
                value={editedGoal.name || ''}
                onChange={(e) => setEditedGoal({ ...editedGoal, name: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: 2,
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
              />
            </Box>
            
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Description
              </Typography>
              <TextField
                value={editedGoal.description || ''}
                onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: 2,
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Target Amount (₹)
                </Typography>
                <TextField
                  type="number"
                  value={editedGoal.targetAmount || ''}
                  onChange={(e) => setEditedGoal({ ...editedGoal, targetAmount: Number(e.target.value) })}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      borderRadius: 2,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Current Amount (₹)
                </Typography>
                <TextField
                  type="number"
                  value={editedGoal.currentAmount || ''}
                  onChange={(e) => setEditedGoal({ ...editedGoal, currentAmount: Number(e.target.value) })}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      borderRadius: 2,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Category
              </Typography>
              <TextField
                select
                value={editedGoal.category || ''}
                onChange={(e) => setEditedGoal({ ...editedGoal, category: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: 2,
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Target Date
              </Typography>
              <TextField
                type="date"
                value={editedGoal.targetDate ? format(new Date(editedGoal.targetDate), 'yyyy-MM-dd') : ''}
                onChange={(e) => setEditedGoal({ 
                  ...editedGoal, 
                  targetDate: e.target.value ? new Date(e.target.value) : undefined 
                })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: 2,
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setEditOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'none',
              fontWeight: '500',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              textTransform: 'none',
              fontWeight: '600',
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            Update
          </Button>
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