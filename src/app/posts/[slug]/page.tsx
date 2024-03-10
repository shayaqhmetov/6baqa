import './post-details.style.scss';

const post = {
    id: 1,
    title: "Переезд в Таиланд с кошкой",
    slug: "pereezd-v-tailand-s-koshkoy",
    description: "История о том как уехать в Таиланд с кошкой если в твоем городе холодная зима и грязный воздух",
};

export default function PostDetails() {
    return <div className="post-details">
        <div className="post-details-header">
            <div className="post-details-header-title">
                <div className='post-details-header-title-box'>
                    <h1>{post.title}</h1>
                    <h3>{post.description}</h3>
                </div>
            </div>
            <img src="https://asiantrails.b-cdn.net/wp-content/uploads/2018/07/thailand.jpg" alt="" />
        </div>
        <div className='post-details-content'>
        </div>
    </div>;
}