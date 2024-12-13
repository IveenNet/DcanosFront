import { Box, FormControl, MenuItem, Select, TextField } from '@mui/material';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <TextField
      placeholder="Buscar por cliente o teléfono"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <FormControl>
      <Select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <MenuItem value="today">Hoy</MenuItem>
        <MenuItem value="week">Esta semana</MenuItem>
        <MenuItem value="all">Todas</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

export default SearchAndFilter;
