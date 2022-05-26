import { styled } from "../../../stitches.config";

import Image from "../../core/Image";
import Text from "../../core/Text";

const WordsmithWrapper = styled('div', {});

const WordsmithNameWrapper = styled('div', {});

export const Wordsmith = ({ values, }) => {
    console.log(values);

    return (
        <WordsmithWrapper className="d-flex">
            <Image src="/avatar_medium.png" css={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'cover',
            }} />
            <WordsmithNameWrapper className="ms-3 d-flex flex-column">
                <Text type="span" size="medium">{(values && values.first_name && values.last_name) && (values.first_name + " " + values.last_name)}</Text>
                <Text type="span" color="darkGray">{(values && values.username) && ("@" + values.username)}</Text>
                <Text type="span">{(values && values.blog_entries_count) && (values.blog_entries_count + ((values.blog_entries_count === 1) ? " entry" : " entries"))}</Text>
            </WordsmithNameWrapper>
        </WordsmithWrapper>
    )
}

export default Wordsmith;