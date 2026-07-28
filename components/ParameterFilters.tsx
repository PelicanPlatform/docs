'use client';

import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SelectFilterProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, options, value, onChange }) => {
  const labelId = `${label.replace(/\s+/g, '-').toLowerCase()}-label`;

  return (
    <FormControl sx={{ flex: 1, minWidth: 220 }} size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        MenuProps={{ PaperProps: { style: { maxHeight: 400 } } }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface ParameterFiltersProps {
  componentOptions: string[];
  configOptions: string[];
  selectedComponent: string;
  selectedConfig: string;
  onComponentChange: (value: string) => void;
  onConfigChange: (value: string) => void;
}

export const ParameterFilters: React.FC<ParameterFiltersProps> = ({
  componentOptions,
  configOptions,
  selectedComponent,
  selectedConfig,
  onComponentChange,
  onConfigChange,
}) => {
  const hasFilters = selectedComponent !== '' || selectedConfig !== '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 2,
        marginY: 2,
      }}
    >
      <SelectFilter
        label="Filter by component"
        options={componentOptions}
        value={selectedComponent}
        onChange={onComponentChange}
      />
      <SelectFilter
        label="Filter by configuration"
        options={configOptions}
        value={selectedConfig}
        onChange={onConfigChange}
      />
      {hasFilters && (
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={() => {
            onComponentChange('');
            onConfigChange('');
          }}
          sx={{ alignSelf: 'center' }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};
