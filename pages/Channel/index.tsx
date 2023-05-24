import ExtraBar from '@common/components/ExtraBar';
import { MenuScroll, Users } from '@common/components/Workspace/style';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import InviteChannelModal from '@components/InviteChannelModal';
import Menu from '@components/Menu';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Container, Header, DragOver, Category, CategoryBox } from '@pages/Channel/style';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [rightbar, setRightbar] = useState(true);
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim() && chatData && channelData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData, myData, channelData, workspace, channel],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData?.id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [channel, myData],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    if (chatData?.length === 1) {
      console.log('toBottomWhenLoaded', scrollbarRef.current);
      setTimeout(() => {
        console.log('scrollbar', scrollbarRef.current);
        scrollbarRef.current?.scrollToBottom();
      }, 500);
    }
  }, [chatData]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  if (!myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <div style={{ display: 'flex' }}>
      <Container style={{ width: '100%' }}>
        <Header>
          <span>#{channel}</span>
          <div className="header-right">
            {/* <span>{channelMembersData?.length}</span>
            <button
              onClick={onClickInviteChannel}
              className="c-button-unstyled p-ia__view_header__button"
              aria-label="Add people to #react-native"
              data-sk="tooltip_parent"
              type="button"
            >
              <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
            </button> */}
            <CategoryBox>
              <Category>chatting</Category>
              <Category>call</Category>
              <Category>memo</Category>
            </CategoryBox>
          </div>
        </Header>
        <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        <InviteChannelModal
          show={showInviteChannelModal}
          onCloseModal={onCloseModal}
          setShowInviteChannelModal={setShowInviteChannelModal}
        />
      </Container>
      <img
        src={`/assets/${rightbar ? `right` : `left`}_arrow.svg`}
        style={{ width: '30px' }}
        onClick={() => setRightbar(!rightbar)}
      />
      {rightbar && <ExtraBar />}
    </div>
  );
};

export default Channel;
