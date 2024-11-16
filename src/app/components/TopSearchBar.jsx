
const TopSearchBar = ({TopSearshsArray , setSearch , setDosearch , setShowInpBox}) => {
    return (
        <div id="top_searchs">
            <span id="main_title_top_search">Top Searches 📈:</span>

            {TopSearshsArray.map((elm, i) => <span onClick={() => {setSearch(elm); setDosearch(true); setShowInpBox(true); }} key={i} className="search">{elm}</span>)}
        </div>
    );
}
export default TopSearchBar