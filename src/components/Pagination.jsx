function Pagination({page,totalPage,setPage}) {

    const createPagination = (page,totalPage) => {
        let pages = []
        if(totalPage<9){

            for(let i=1; i<=totalPage; i++){
                pages.push(i);
            }
        }
        else if(page<4 && totalPage>8) {

            pages = [1,2,3,4,5,'...',(totalPage-2),(totalPage-1),totalPage]
        }
        else if(page>3 && totalPage>8){

            if(page<(totalPage-2)) {

                pages = page === 4 ? [1, 2, 3, 4, 5] : (page === 5 ? [1, 2, 3, 4, 5, 6] : (page!==(totalPage-3) ? [1, 2, 3, "...", (page - 1), page, (page + 1)]  : [1, 2, 3, "...",(totalPage-4)]))
                pages = page !== (totalPage-3) ? [...pages, "...",(totalPage - 2), (totalPage - 1), totalPage] : [...pages, (totalPage - 3),(totalPage - 2), (totalPage - 1), totalPage]
            }else{

                pages = [1,2,3,"...",(totalPage - 3),(totalPage - 2), (totalPage - 1), totalPage];
            }
        }

        return pages
    }

    const pages = createPagination(parseInt(page),parseInt(totalPage))



    return totalPage>1 &&(
        <div className="btn-group">

            {
                pages.map((pg,key) => {
                    const active = pg === parseInt(page) ? "#064663" : "#041C32";
                    return pg !== "..." ? <button className="btn" style={{background:active, color:'#fff', border:"0 important!", outline:"none !important", cursor:"pointer", padding:"5px 10px"}} key={key} onClick={() => setPage(pg)}>
                            {pg}
                        </button> :
                        <button key={key} disabled="disabled" style={{padding:"5px 10px"}}>...</button>
                })
            }

        </div>
    );
}



export default Pagination;