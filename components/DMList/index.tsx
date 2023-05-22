import { CollapseButton } from '@components/DMList/style';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import Member from '@components/Member';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

const DMList: FC = () => {
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [channelCollapse, setChannelCollapse] = useState(false);

  const onCloseModal = useCallback(() => {
    setShowInviteWorkspaceModal(false);
  }, []);
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);
  return (
    <>
      <div style={{ display: 'flex', padding: '10px 0' }}>
        <span style={{ fontWeight: 700, padding: '0 30px' }}>워크스페이스 내 사용자</span>
        <div style={{ width: '18px', paddingTop: '2px' }} onClick={onClickInviteWorkspace}>
          <img src="/assets/create.svg" />
        </div>
      </div>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            return (
              <>
                <Member id={member.id} nickname={member.nickname} email={member.email} />
              </>
            );
          })}
      </div>

      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      ></InviteWorkspaceModal>
    </>
  );
};

export default DMList;
