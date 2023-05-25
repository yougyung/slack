import React, { VFC } from 'react';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import { Chats, WorkspaceWrapper } from './style';
import WorkspaceList from '@pages/Layout/component/WorkspaceList';
import SideBar from '@pages/Layout/component/SideBar';
const Workspace: VFC = () => {
  const Channel = loadable(() => import('@pages/Channel'));
  const DirectMessage = loadable(() => import('@pages/DirectMessage'));
  const Note = loadable(() => import('@pages/Note'));

  return (
    <div style={{ display: 'flex' }}>
      <WorkspaceList />
      <WorkspaceWrapper>
        <SideBar />
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/chat/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
            <Route path="/workspace/:workspace/note/:note" component={Note} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
