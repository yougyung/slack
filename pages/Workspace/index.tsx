import React, { VFC, useState } from 'react';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import { WorkspaceWrapper } from './style';
import WorkspaceList from '@pages/Workspace/component/WorkspaceList';
import Header from './component/Header';
import SideBar from '@pages/Workspace/component/SideBar';
import ExtraBar from '@common/components/ExtraBar';
const Workspace: VFC = () => {
  const [rightbar, setRightbar] = useState(true);

  const Channel = loadable(() => import('@pages/Channel'));
  const DirectMessage = loadable(() => import('@pages/DirectMessage'));
  const Note = loadable(() => import('@pages/Note'));
  const Call = loadable(() => import('@pages/Call'));

  return (
    <div style={{ display: 'flex' }}>
      <WorkspaceList />
      <WorkspaceWrapper>
        <SideBar />
        <div style={{ flex: '1' }}>
          <Header />
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel/chat" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id/chat" component={DirectMessage} />
            <Route path="/workspace/:workspace/channel/:channel/note" component={Note} />
            <Route path="/workspace/:workspace/dm/:id/note" component={Note} />
            <Route path="/workspace/:workspace/channel/:channel/call" component={Call} />
            <Route path="/workspace/:workspace/dm/:id/call" component={Call} />
          </Switch>
        </div>
      </WorkspaceWrapper>
      <img
        src={`/assets/${rightbar ? `right` : `left`}_arrow.svg`}
        style={{ width: '30px' }}
        onClick={() => setRightbar(!rightbar)}
        alt="arrow"
      />
      {rightbar && <ExtraBar />}
    </div>
  );
};

export default Workspace;
