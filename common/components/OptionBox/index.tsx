import React from 'react';
import { Div, FlexColumn } from '@common/components/OptionBox/style';
const OptionBox = () => {
  return (
    <Div>
      <FlexColumn>
        <div>
          <img src="/assets/chatting.svg" style={{ color: '#fff', width: '20px' }} />
        </div>
        <div>
          <img src="/assets/video.svg" style={{ color: '#fff', width: '20px' }} />
        </div>
      </FlexColumn>
      <FlexColumn>
        <div>
          <img src="/assets/note.svg" style={{ color: '#fff', width: '20px' }} />
        </div>
        <div>
          <img src="/assets/voice.svg" style={{ color: '#fff', width: '20px' }} />
        </div>
      </FlexColumn>
    </Div>
  );
};
export default OptionBox;
