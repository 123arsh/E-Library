import React from 'react';
import { useLocation } from 'react-router-dom';

const booksData = [
    {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImg: '/booksImg/atomic-habits.jpg',
        value: 'motivational',
        pdf: '/books/Atomic_Habits.pdf',
        description: 'In Atomic Habits, James Clear emphasizes that tiny changes lead to remarkable results over time — success is simply the product of daily small improvements...'
      },
      {
        id: 2,
        title: 'Master Your Emotions',
        author: 'Thibaut Meurisse',
        coverImg: '/booksImg/mye.jpg',
        value: 'motivational',
        pdf: '/books/Master_Your_Emotions_A_Practical_Guide_to_Overcome.pdf',
        description: 'In Master Your Emotions, Thibaut Meurisse explains how emotions influence our thoughts, actions, and overall quality of life...'
      },
      {
        id: 3,
        title: 'Self Discipline Mindset',
        author: 'Curtis Leone',
        coverImg: '/booksImg/sellf-discipline-mindset.jpg',
        value: 'motivational',
        pdf: '/books/sdms.pdf',
        description: 'In Self-Discipline Mindset, Curtis Leone explores how mastering discipline is the true foundation for achieving any form of success...'
      },
      {
        id: 4,
        title: 'The Monk Who Sold His Ferrari',
        author: 'Robin Sharma',
        coverImg: '/booksImg/mshf.jpg',
        value: 'motivational',
        pdf: '/books/The_Monk_Who_Sold_His_Ferrari.pdf',
        description: 'In The Monk Who Sold His Ferrari, Robin Sharma tells the inspiring story of Julian Mantle...'
      },
      {
        id: 5,
        title: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        coverImg: '/booksImg/saongf.jpg',
        value: 'motivational',
        pdf: '/books/The_Subtle_Art_of_Not_Giving_Fck.pdf',
        description: 'In The Subtle Art of Not Giving a F*ck, Mark Manson challenges the traditional self-help advice of always striving for positivity...'
      },
      {
        id: 6,
        title: 'Chanakya Neeti',
        author: 'Chanakya Neeti',
        coverImg: '/booksImg/chnakyaNeeti.jpg',
        value: 'motivaltional',
        pdf: '/books/chnakyaNeeti.pdf',
        description: 'Chanakya Neeti is a collection of aphorisms and teachings by the ancient Indian strategist Chanakya, offering practical wisdom on politics, leadership, ethics, and personal conduct. It emphasizes intelligence, discipline, and strategic thinking for success in life and governance.'
      },
      {
        id: 7,
        title: 'When Breath Become Air',
        author: 'Paul Kalanithi',
        coverImg: '/booksImg/wbba.jpg',
        value: 'romantic',
        pdf: '/books/When_Breath_Becomes_Air.pdf',
        description: 'When Breath Becomes Air is a poignant memoir by a neurosurgeon facing terminal cancer, reflecting on life, death, and the search for meaning. Its a powerful meditation on living fully, even in the face of dying'
      },
      {
        id: 8,
        title: 'Bhagwat Geeta',
        author: 'A. C. Bhaktivedanta Swami Prabhupada',
        coverImg: '/booksImg/bhagwatGita.jpg',
        value: 'spiritual',
        pdf: '/books/Bhagwad_Gita.pdf',
        description: 'The Bhagavad Gita is a sacred Hindu scripture where Lord Krishna imparts spiritual wisdom and guidance to Arjuna on the battlefield of Kurukshetra. It explores themes of duty, righteousness, selflessness, and the path to liberation'
      },
      {
        id: 9,
        title: 'Shiv Puran',
        author: 'sage Vyasa',
        coverImg: '/booksImg/shiv-puran.jpg',
        value: 'spiritual',
        description: 'Shiv Puran is one of the major Hindu Puranas dedicated to Lord Shiva, containing stories, hymns, and teachings about his divine nature, creation, destruction, and cosmic roles. It emphasizes devotion (bhakti), righteousness (dharma), and the spiritual path to attain moksha (liberation) through Shivas grace.'
      },
      {
        id: 10,
        title: 'Chattrapati Shivaji Maharaj',
        author: 'Jadunath Sarkar',
        coverImg: '/booksImg/shivaji-maharaj.jpg',
        value: 'action',
        pdf: '/books/shivajiMaharaj.pdf',
        description: 'Chhatrapati Shivaji Maharaj was a visionary 17th-century Indian warrior king and the founder of the Maratha Empire, known for his valor, strategic brilliance, and progressive governance. He championed swarajya (self-rule), upheld Hindu cultural values, and promoted tolerance, administration reforms, and the welfare of his people.'
      },
      {
        id: 11,
        title: 'Atharveda',
        author: 'Atharva Rishi and Angirasa Rishi',
        coverImg: '/booksImg/atarveda.jpg',
        value: 'spiritual',
        pdf: '/books/atharveda.pdf',
        description: 'The Atharvaveda is often considered the Veda of practical knowledge, and it provides a unique perspective on life, covering topics that range from healing and protection to philosophical insights. Unlike the other Vedas, which are more focused on rituals and hymns for the gods, the Atharvaveda is more concerned with the practical aspects of human existence, such as health, family life, and community welfare.'
      },
      {
        id:12,
        title: 'yajurveda',
        author: ' sage vyasa',
        coverImg: '/booksImg/yajurveda.jpg',
        value: 'spiritual',
        pdf: '/books/yajurveda.pdf',
        description: 'The Yajurveda is traditionally attributed to Vyasa, a revered sage in Hinduism. Vyasa is also credited with compiling the other Vedas and writing the Mahabharata, among other significant texts in Hindu tradition.'
      },
      {
        id:13,
        title: 'samveda',
        author: ' sage vyasa',
        coverImg: '/booksImg/saveda.jpg',
        value: 'spiritual',
        pdf: '/books/samveda.pdf',
        description: 'The Samveda is traditionally attributed to Vyasa, the same sage who is believed to have compiled the other Vedas. It is primarily a collection of hymns and chants meant for ceremonial use, with a strong focus on music and melody.'
      },
      {
        id:14,
        title: 'Rigveda',
        author: ' sage vyasa',
        coverImg: '/booksImg/regveda.jpg',
        value: 'spiritual',
        pdf: '/books/righveda.pdf',
        description: 'The Rigveda is traditionally attributed to Vyasa, who is also credited with compiling the Vedas. It is the oldest of the four Vedas, consisting of hymns dedicated to various deities and is a key source of Vedic knowledge and rituals.'
      },
      {
        id:15,
        title: 'yajurveda',
        author: ' sage vyasa',
        coverImg: '/booksImg/yajurveda.jpg',
        value: 'spiritual',
        pdf: '/yajurveda.pdf',
        description: 'The Yajurveda is traditionally attributed to Vyasa, a revered sage in Hinduism. Vyasa is also credited with compiling the other Vedas and writing the Mahabharata, among other significant texts in Hindu tradition.'
      },
      {
        id:16,
        title: 'Maharana Partap',
        author: 'Kesar Singh Chibber',
        coverImg: '/booksImg/maharana.jpeg',
        value: 'motivational',
        pdf: '/books/Maharana - inner.pdf.pdf',
        description: 'Maharana Pratap, the legendary Rajput king of Mewar, is widely known for his unwavering resistance against the Mughal Empire, especially during the Battle of Haldighati. He is celebrated for his courage, leadership, and commitment to preserving his kingdoms independence.'
      },
      {
        id:17,
        title: 'Twisted Games',
        author: 'Ana Huang',
        coverImg: '/booksImg/tw.webp',
        value: 'romantic',
        pdf: '/books/Twisted_Games_A_Forbidden_Royal_Bodyguard_Romance.pdf',
        description: 'Twisted Games is a contemporary royal bodyguard romance novel by Ana Huang, published on July 29, 2021. It is the second book in the Twisted series, following Twisted Love, and can be read as a standalone. The story follows Bridget von Ascheberg, the rebellious crown princess of Eldorra, and Rhys Larsen, her stoic bodyguard. Despite their professional boundaries, their undeniable chemistry leads to a forbidden romance that could jeopardize both their lives and the kingdom'
      }
];

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query')?.toLowerCase() || '';

  const filteredBooks = booksData.filter(
    book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
  );

  return (
    <div className="p-10 text-white bg-[#080d13] min-h-screen">
      <h1 className="text-2xl mb-4">Search Results for: <span className="text-blue-400">{query}</span></h1>
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 ">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-[#0f172a] p-4 text-white rounded-lg">
              <img src={book.coverImg} alt={book.title} className="w-50 h-64 object-cover rounded-lg" />
              <h2 className="text-xl font-bold mt-2">{book.title}</h2>
              <p className="text-gray-400">{book.author}</p>
              <p className="text-sm text-gray-400 mt-2">{book.description}</p>
              {book.pdf && (
                <a
                  href={book.pdf}
                  className="flex justify-center items-center text-blue-500 mt-4 h-[40px] w-[120px] border border-[#94A3B8] rounded-xl hover:bg-blue-600 hover:border-0 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read PDF
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
