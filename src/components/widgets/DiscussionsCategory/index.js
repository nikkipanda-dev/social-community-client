import { useParams, useOutletContext, } from "react-router-dom";

export const DiscussionsCategory = () => {
    const params = useParams();

    console.log(params.slug);

    return (
        <div>
            Category discuss
        </div>
    )
}

export default DiscussionsCategory;