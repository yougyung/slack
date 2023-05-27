import { Div } from '@pages/Layout/component/DMList/style';
import useSocket from '@hooks/useSocket';
import { IUser } from '@typings/db';
import fetcher from '@common/utils/fetcher';
import gravatar from 'gravatar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { NavLink } from 'react-router-dom';

interface Props {
  id: number;
  nickname: string;
  email: string;
}
function Member(member: Props) {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const [socket] = useSocket(workspace);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  useEffect(() => {
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off('onlineList');
    };
  }, [socket]);

  console.log(onlineList);
  const isOnline = onlineList.includes(member.id);
  return (
    <Div>
      <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
        <div style={{ display: 'flex' }}>
          <img
            style={{ borderRadius: '10px', marginRight: '8px' }}
            src={gravatar.url(member.email, { s: '36px', d: 'retro' })}
            alt={member.nickname}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <i
                className={`c-icon ${
                  isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                }`}
                style={{ fontSize: '2px !important', padding: 0, margin: 0 }}
              />
              {member.id === userData?.id && <span> (나) </span>}
              <span>{member.nickname}</span>
            </div>
          </div>
        </div>
      </NavLink>
    </Div>
  );
}

export default Member;
