import * as React from 'react';

interface RegisterUserProps {
    nickName: string;
    joinChatClick: any;
    updateChatState: any;
}

export const RegisterUserView = (props: RegisterUserProps) => {
    return (
        <div>
            <label htmlFor="nickNameInput">Select Nickname:</label>
            <div className="input-group">
                <input
                    type="text"
                    name="nickNameInput"
                    className="form-control width100"
                    value={props.nickName}
                    onChange={props.updateChatState} />
                <span className="input-group-btn">
                    <button className="btn btn-info" onClick={props.joinChatClick}>Join</button>
                </span>
            </div>
        </div>
    );
};