import OptionBox from '@common/components/OptionBox';
import { ProfileImg } from '@common/components/Workspace/style';
import { Div } from '@components/DMList/style';
import useSocket from '@hooks/useSocket';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import React, { FC, useCallback, useEffect, useState } from 'react';
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
      <Div
        onClick={() => setOption(!option)}
        style={{ display: 'flex', justifyContent: 'space-evenly', backgroundColor: option ? '#0f172a' : '#1e293b' }}
      >
        <div>
          <img
            style={{ borderRadius: '10px', display: 'flex', flexDirection: 'column' }}
            src={gravatar.url(member.email, { s: '50px', d: 'retro' })}
            alt={member.nickname}
          />
          <i
            className={`c-icon ${isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'}`}
            style={{ fontSize: '2px !important', padding: 0, margin: 0 }}
          />
          <span style={{ fontSize: '12px' }}>{member.nickname}</span>
          {member.id === userData?.id && <span style={{ fontSize: '10px' }}> (나)</span>}
        </div>
        <OptionBox />
      </Div>
    </>
  );
}

export default Member;
