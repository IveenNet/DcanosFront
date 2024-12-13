import { Avatar } from '@mui/material';
import { styled } from '@mui/system';

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    marginBottom: theme.spacing(1),
    marginRight: 0
  }
}));
