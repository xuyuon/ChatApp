import { CardHeader, Avatar } from "@mui/material";

const NameTag = ({ name }) => {
  return (
    <CardHeader
      avatar={<Avatar alt={name}>{name[0]}</Avatar>}
      title={name}
    />
  );
};
export default NameTag;
