import "./UserQueryBubble.scss";

export const UserQuery = ({ content }: { content: string }) => {
  return (
    <div className={"user-query"}>
      <div className={"user-chat-bubble"}>{content}</div>
    </div>
  );
};
