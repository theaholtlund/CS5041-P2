import { Card } from "react-native-paper";

export default function MessageCard(props) {
  return (
    <Card
      style={{
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: props.i === props.iMax - 1 ? 10 : 0,
      }}
    >
      <Card.Title
        title={props.message.message}
        subtitle={new Date(props.message.created).toLocaleString()}
      />
    </Card>
  );
}
