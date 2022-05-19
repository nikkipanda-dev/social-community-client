import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const RemoveFriendWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {});

export const RemoveFriend = ({ 
    css,
    removeUserFriend, 
    handleHideModal,
}) => {

    return (
        <RemoveFriendWrapper {...css && { css: { ...css } }}>
            <SubmitButtonWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                <Button
                type="button"
                text="Cancel"
                className="flex-grow-1 flex-sm-grow-0"
                onClick={() => handleHideModal()} />
                <Button
                type="button"
                text="Remove"
                color="red"
                className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                onClick={() => removeUserFriend()} />
            </SubmitButtonWrapper>
        </RemoveFriendWrapper>
    )
}

export default RemoveFriend;
