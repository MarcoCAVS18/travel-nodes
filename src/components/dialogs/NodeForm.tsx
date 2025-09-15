import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Chip,
  Typography,
  Divider,
} from '@mui/material';
import { TravelNode, NodeType } from '../../types/node.types';
import { NODE_TYPES, PRIORITIES, NODE_STATUS, CURRENCIES } from '../../utils/constants';
import { validateNode } from '../../utils/nodeUtils';

interface NodeFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: TravelNode;
  nodeType?: NodeType;
  onSubmit: (data: Partial<TravelNode>) => void;
  onCancel: () => void;
}

const NodeForm: React.FC<NodeFormProps> = ({
  mode,
  initialData,
  nodeType,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<TravelNode>>({
    title: '',
    description: '',
    type: nodeType || 'event',
    confirmed: false,
    priority: 'medium',
    status: 'pending',
    tags: [],
    details: {},
    date: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof TravelNode, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDetailsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, [field]: value }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = () => {
    const validation = validateNode(formData);
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        if (error.includes('Title')) newErrors.title = error;
        if (error.includes('Description')) newErrors.description = error;
      });
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Information */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Basic Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isReadOnly}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type || 'event'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Type"
              >
                {Object.entries(NODE_TYPES).map(([key, config]) => (
                  <MenuItem key={key} value={key}>{config.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority || 'medium'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                label="Priority"
              >
                {Object.entries(PRIORITIES).map(([key, config]) => (
                  <MenuItem key={key} value={key}>{config.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'pending'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                {Object.entries(NODE_STATUS).map(([key, config]) => (
                  <MenuItem key={key} value={key}>{config.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date"
              type="datetime-local"
              value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleInputChange('date', e.target.value ? new Date(e.target.value) : undefined)}
              disabled={isReadOnly}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.confirmed || false}
                  onChange={(e) => handleInputChange('confirmed', e.target.checked)}
                  disabled={isReadOnly}
                />
              }
              label="Confirmed"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* General Details */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.details?.location || ''}
              onChange={(e) => handleDetailsChange('location', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={formData.details?.cost || ''}
              onChange={(e) => handleDetailsChange('cost', parseFloat(e.target.value))}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.details?.currency || 'AUD'}
                onChange={(e) => handleDetailsChange('currency', e.target.value)}
                label="Currency"
              >
                {CURRENCIES.map(currency => (
                  <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              value={formData.details?.website || ''}
              onChange={(e) => handleDetailsChange('website', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.details?.phone || ''}
              onChange={(e) => handleDetailsChange('phone', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* Tags */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Tags</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {formData.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={isReadOnly ? undefined : () => handleRemoveTag(tag)}
              size="small"
            />
          ))}
        </Box>
        {!isReadOnly && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              label="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button onClick={handleAddTag} variant="outlined" size="small">
              Add
            </Button>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Notes */}
      <Box>
        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={4}
          value={formData.details?.notes || ''}
          onChange={(e) => handleDetailsChange('notes', e.target.value)}
          disabled={isReadOnly}
        />
      </Box>

      {/* Actions */}
      {mode !== 'view' && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NodeForm;
