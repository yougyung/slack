import { Div } from '@components/DMList/style';
import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

function Member(member: any) {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const [socket] = useSocket(workspace);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [option, setOption] = useState<boolean>(false);

  useEffect(() => {
    console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);
  const isOnline = onlineList.includes(member.id);

  return (
    <>
      <Div onClick={() => setOption(!option)}>
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
      </Div>
    </>
  );
}

export default Member;
