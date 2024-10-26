
const TopSearchBar = ({TopSearshsArray , setSearch , setDosearch , showInpBox}) => {
    return (
        <div id="top_searchs">
            <span id="main_title_top_search">Top Searchs 🔥:</span>

            {TopSearshsArray.map((elm, i) => <span onClick={() => {setSearch(elm); setDosearch(true); showInpBox(true); }} key={i} className="search">{elm}</span>)}
        </div>
    );
}
export default TopSearchBar