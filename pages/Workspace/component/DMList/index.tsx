import InviteWorkspaceModal from '@pages/Workspace/component/InviteWorkspaceModal';
import Member from '@common/components/Member';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@common/utils/fetcher';
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

  const onCloseModal = useCallback(() => {
    setShowInviteWorkspaceModal(false);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);
  return (
    <>
      <div style={{ display: 'flex', padding: '10px 0' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, padding: '0 30px' }}>워크스페이스 내 사용자</span>
        <div style={{ width: '18px', paddingTop: '2px' }} onClick={onClickInviteWorkspace}>
          <img src="/assets/create.svg" />
        </div>
      </div>
      <div style={{ maxHeight: '50%', overflow: 'scroll' }}>
        {memberData?.map((member) => {
          return <Member key={member.id} id={member.id} nickname={member.nickname} email={member.email} />;
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
