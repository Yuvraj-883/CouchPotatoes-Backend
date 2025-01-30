import movies from "../../models/movies";

const resolvers = {
    Query:{
        movies:async(_:any, {pageNumber=1, pageSize=12, genres=[]}: {pageNumber?: number, pageSize?: number, genres?: string[]})=> {
            try{
                const skip = pageSize*(pageNumber-1);
                const totalMovies = await movies.countDocuments();
                const totalPages = Math.ceil(totalMovies/pageSize);
                
                let genresFilter = [];
                let allMovies = [];
                if(genres.length>0){
                    genresFilter = genres; 
                    allMovies = await movies.aggregate([
                        {
                            $match:{genres:{$in:genresFilter}, title:{$ne:null}}
                        }, 
                        {
                            $skip:skip
                        }, 
                        {
                            $limit:pageSize
                        }
                    ])
                     
                }
                else{
                      allMovies = await movies.aggregate([
                             {
                                 $addFields:{
                                     popularity:{
                                         $avg:['$awards.wins', '$awards.nominations', '$imdb.rating', '$imdb.votes', '$tomatoes.viewer.rating', '$tomatoes.viewer.numReviews' ]
                                     }
                                 }
                             },
                             {
                                 $sort:{popularity:-1}
                             },
                             {
                                 $skip:(pageNumber-1)*pageSize
                             },{
                                 $limit: pageSize
                             }
                     
                           ]); 

                }

                console.log(allMovies);
                
                return {
                    movies: allMovies.map(movie => ({
                        ...movie,
                        id: movie._id.toString() // ✅ Convert ObjectId to string manually
                      })),
                      
                    totalMovies,
                    totalPages,
                    currentPage:pageNumber
                };
            }
            catch(error){
                console.log(error);
            }
        }, 
        movie: async(_: any, args: { id: string })=> {
            try{
                return await movies.findById(args.id);
            }
            catch(error){
                console.log(error);

        }
    }, 
    getGenres:async()=>{
        try{
            const genres = await movies.aggregate([
                {$unwind:"$genres"},
                {$group:{_id: null, genres: {$addToSet: "$genres"}}},
                {$project:{genres:1}}
            ])
            // console.log(genres);
            return genres[0]?.genres|| [];
        }
        catch(error){
            console.log(error);
    }
}
}

}
export default resolvers;