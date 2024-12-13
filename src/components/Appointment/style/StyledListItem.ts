import { ListItem, ListItemProps } from '@mui/material';
import { styled } from '@mui/system';

interface StyledListItemProps extends ListItemProps {
  estado?: 'pendiente' | 'completada';
}

export const StyledListItem = styled(ListItem)<StyledListItemProps>(({ theme, estado }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.spacing(1),
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  ...(estado === 'pendiente' && {
    borderLeft: `5px solid ${theme.palette.warning.main}`,
  }),
  ...(estado === 'completada' && {
    borderLeft: `5px solid ${theme.palette.success.main}`,
  }),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));
