const HeaderCanban = ({text, index}) => {
    
    const color = ["bg-red-400", "bg-orange-400", "bg-yellow-300", "bg-blue-400", "bg-emerald-400"]
    
    
    const picked = color.at(index)
    
    return (
        <div className={`w-full text-center mb-2 text-indigo-950 text-xl rounded-b-3xl pb-3 pt-1 ${picked}`}>
            <h1>{text}</h1>
        </div>
    )
}

export default HeaderCanban