import { CategoryBox, Category, Header as HeaderStyle } from '@pages/Channel/style';
import React, { VFC } from 'react';
import gravatar from 'gravatar';
import { NavLink, useParams } from 'react-router-dom';
import { IUser } from '@typings/db';
import fetcher from '@common/utils/fetcher';
import useSWR from 'swr';

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
  return (
    <HeaderStyle>
      <div className="header-right">
        {chatType === 'chat' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>#{channeltarget.length > 7 ? '일반' : channeltarget}</span>
              <div className="header-right-add">
                <span>{/* {channelMembersData?.length} */}</span>
                <button
                  // onClick={onClickInviteChannel}
                  className="c-button-unstyled p-ia__view_header__button"
                  aria-label="Add people to #react-native"
                  data-sk="tooltip_parent"
                  type="button"
                >
                  <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
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
    </HeaderStyle>
  );
};

export default Header;
