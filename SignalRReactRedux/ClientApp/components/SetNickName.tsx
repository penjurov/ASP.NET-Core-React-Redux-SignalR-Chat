import * as React from 'react';

interface RegisterUserProps {
    nickname: string;
    joinChatClick: any;
    updateChatState: any;
    isChangeNickname: Boolean;
}

export const SetNickname = (props: RegisterUserProps) => {
    let buttonText = props.isChangeNickname ? 'Change nickname' : 'Join';

    return (
        <div>
            <label htmlFor="nicknameInput">Select Nickname:</label>
            <div className="input-group">
                <input
                    type="text"
                    name="nicknameInput"
                    className="form-control width100"
                    value={props.nickname}
                    onChange={props.updateChatState} />
                <span className="input-group-btn">
                    <button className="btn btn-info" onClick={props.joinChatClick}>{buttonText}</button>
                </span>
            </div>
        </div>
    );
};