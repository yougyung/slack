import { CategoryBox, Category, Header as HeaderStyle } from './style';
import React, { VFC, useCallback, useState } from 'react';
import gravatar from 'gravatar';
import { NavLink, useParams } from 'react-router-dom';
import { IUser } from '@typings/db';
import fetcher from '@common/utils/fetcher';
import useSWR from 'swr';
import InviteChannelModal from '@pages/Workspace/component/InviteChannelModal';

const Header: VFC = () => {
  const { workspace } = useParams<{ workspace: string }>();

  // const tooltype;
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const pathname = window.location.pathname;
  const chatType = pathname.split('/')[3];
  const channeltarget = pathname.split('/')[4];
  const dmtarget = memberData?.find((member) => member.id === Number(channeltarget));
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);
  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);
  const { data: channelMembersData } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channeltarget}/members` : null,
    fetcher,
  );
  return (
    <HeaderStyle>
      <div className="header-right">
        {chatType === 'channel' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>#{channeltarget.length > 7 ? '일반' : channeltarget}</span>
              <div className="header-right-add">
                <button
                  onClick={onClickInviteChannel}
                  className="c-button-unstyled p-ia__view_header__button"
                  aria-label="Add people to #react-native"
                  data-sk="tooltip_parent"
                  type="button"
                >
                  <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
                  <span>{channelMembersData?.length}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'align-center' }}>
            {dmtarget && (
              <>
                <img src={gravatar.url(dmtarget.email, { s: '24px', d: 'retro' })} alt={dmtarget.nickname} />
                <span>{dmtarget.nickname}</span>
              </>
            )}
          </div>
        )}
      </div>
      <CategoryBox>
        <NavLink style={{ textDecoration: 'none' }} to={`/workspace/${workspace}/${chatType}/${channeltarget}/chat`}>
          <Category>chatting</Category>
        </NavLink>
        <NavLink style={{ textDecoration: 'none' }} to={`/workspace/${workspace}/${chatType}/${channeltarget}/call`}>
          <Category>call</Category>
        </NavLink>
        <NavLink style={{ textDecoration: 'none' }} to={`/workspace/${workspace}/${chatType}/${channeltarget}/memo`}>
          <Category>memo</Category>
        </NavLink>
      </CategoryBox>
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </HeaderStyle>
  );
};

export default Header;
