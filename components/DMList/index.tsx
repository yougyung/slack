import { CollapseButton } from '@components/DMList/style';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import Member from '@components/member';
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
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>사용자</span>
        <span style={{ paddingRight: '20px', float: 'right' }} onClick={onClickInviteWorkspace}>
          +
        </span>
      </h2>
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
