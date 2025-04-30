import React, { useState } from 'react'

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
      }
];

const Genre = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleFilter = (genre) => {
    setSelectedGenre(genre);
  };

  const filteredBooks = selectedGenre
    ? booksData.filter(book => book.value.toLowerCase() === selectedGenre.toLowerCase())
    : booksData;

  return (
    <div className='w-full min-h-screen bg-[#0b0f12] text-white'>
      <div className='flex justify-center items-center h-[100px] w-full gap-10 border border-[#94A3B8] rounded-2xl bg-[#0b0f12]'>
        {['horror', 'spiritual', 'action', 'romantic', 'motivational'].map((genre) => (
          <button
            key={genre}
            onClick={() => handleFilter(genre)}
            className='h-[45px] bg-[#0b0f12] font-bold w-[150px] rounded-xl font-poppins border border-[#94A3B8] text-[#94A3B8] hover:text-white hover:border-white'
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8'>
        {filteredBooks.map(book => (
          <div key={book.id} className='border border-[#94A3B8] p-4 rounded-lg'>
            <img src={book.coverImg} alt={book.title} className='w-full h-64 object-cover rounded-md' />
            <h2 className='text-xl font-bold mt-2'>{book.title}</h2>
            <p className='text-sm text-gray-400 mb-2'>by {book.author}</p>
            <p className='text-sm'>{book.description.slice(0, 100)}...</p>
            {book.pdf && (
              <a href={book.pdf} target='_blank' rel='noopener noreferrer' className='block mt-3 text-blue-400 hover:underline'>
                Read PDF
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genre;
