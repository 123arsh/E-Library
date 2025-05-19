const Alert = ({ closeAlert }) => {
  return (
    <div className="fixed flex justify-center items-center h-screen w-full bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-80 text-center">
        <button onClick={closeAlert} className="absolute top-2 right-2 text-red-600 font-bold text-xl">X</button>
        <h2 className="text-xl font-bold mb-4">Please Login to Proceed</h2>
        <p className="mb-4">You need to be logged in to view this book.</p>
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
      </div>
    </div>
  );
};


export default Alert;
