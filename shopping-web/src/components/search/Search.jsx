import "./Search.css";

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="frame-4">
      <input type="text" 
      placeholder="Search..." 
      className="search-bar"
      onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
  );
};

export default Search;
