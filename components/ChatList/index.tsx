import { IDM } from '@typings/db';
import { ChatZone } from './style';
import React, { VFC, useCallback, useRef } from 'react';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  chatData?: IDM[];
}
const ChatList: VFC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat}></Chat>
        ))}
      </Scrollbars>
    </ChatZone>
  );
};
export default ChatList;
