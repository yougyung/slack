import React, { useCallback, useEffect, useRef, useState } from 'react';
import gravatar from 'gravatar';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import { Container } from './style';
import { Header } from '@pages/Channel/style';
import fetcher from '@common/utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@common/components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import Scrollbars from 'react-custom-scrollbars-2';
import ChatList from '@common/components/ChatList';
import makeSection from '@common/utils/makeSection';
import useSocket from '@hooks/useSocket';
import ExtraBar from '@common/components/ExtraBar';
import { Category, CategoryBox } from '@pages/Channel/style';
import { NavLink } from 'react-router-dom';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [rightbar, setRightbar] = useState(true);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const [socket] = useSocket(workspace);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
          })
          .catch((error) => {
            console.dir(error);
          });
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );

  const onMessage = useCallback((data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 500
          ) {
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  if (!userData || !myData) return null;

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <div style={{ display: 'flex' }}>
      <Container style={{ width: '100%' }}>
        <Header>
          <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nicknam} />
          <span>{userData.nickname}</span>
          <div className="header-right">
            <CategoryBox>
              <NavLink style={{ textDecoration: 'none' }} to={`/workspace/${workspace}/chat/${id}`}>
                <Category>chatting</Category>
              </NavLink>
              <NavLink style={{ textDecoration: 'none' }} to={`/workspace/${workspace}/note/${id}`}>
                <Category>call</Category>
              </NavLink>
              <NavLink style={{ textDecoration: 'none' }} to={`/workspace/${workspace}/note/${id}`}>
                <Category>memo</Category>
              </NavLink>
            </CategoryBox>
          </div>
        </Header>
        <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
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
export default DirectMessage;
