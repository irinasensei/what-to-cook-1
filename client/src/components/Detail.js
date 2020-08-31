import React, { Component } from "react";
import "./Detail.css";

const RECIPE_API_KEY = process.env.REACT_APP_RECIPE_API_KEY;

export default class Detail extends Component {
  state = {
    recipe: null,
    isFavourite: 1,
    userLoggedIn: 0,
  };

  //add recipe to favourites
  addToFavourites = async () => {
    console.log("adding recipe to favourites");
    const bodyToSend = {
      recipeId: this.props.match.params.id,
      image: this.state.recipe.image,
      title: this.state.recipe.title,
    };
    try {
      await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(bodyToSend),
      });
    } catch (err) {
      console.log(err);
    }
    //fetch request to add user-recipe link
    this.setState({
      isFavourite: 1,
    });
  };

  //remove recipe from favourites
  removeFromFavourites = async () => {
    //fetch request to remove user-recipe link
    const recipeId = { recipeId: this.props.match.params.id };
    try {
      await fetch("/api/favourites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(recipeId),
      });
    } catch (err) {
      console.log(err);
    }
    console.log("removing recipe from favourites");
    this.setState({
      isFavourite: 0,
    });
  };

  //check if recipe is already in favourites
  isInFavourites = async () => {
    const { id } = this.props.match.params;
    //check if recipe in favourites
    //if it is, change state isFavourite 1
    try {
      const result = await fetch(`/api/favourites/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });
      const json = await result.json();
      //   console.log(json);
      //if the response is not negative meaning a match was found
      if (json.msg !== "Not a favourite") {
        this.setState({ isFavourite: 1 });
      } else {
        this.setState({ isFavourite: 0 });
      }
    } catch (err) {
      console.log(err);
    }
  };

  isUserLoggedIn = async () => {
    //check if user logged in
    //set flag user logged in
    console.log("checking if user is logged in");
    let token = localStorage.getItem("token");
    // console.log("token", token);
    if (token) {
      try {
        await fetch("api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        //user is already logged in - changing flag in state
        this.setState({
          userLoggedIn: 1,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        userLoggedIn: 0,
      });
    }
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${RECIPE_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => this.setState({ recipe: res }))
      .catch((err) => {
        console.log(err);
      });
    //check if the recipe shown is already a favourite
    this.isUserLoggedIn();
    this.isInFavourites();
    console.log(this.state.recipe);
  }

  render() {
    const { recipe, isFavourite, userLoggedIn } = this.state;
    return (
      <div>
        {!recipe ? (
          <span>loading...</span>
        ) : (
          <div>
            <h3>
              {recipe.title}{" "}
              {isFavourite && userLoggedIn ? (
                <i class="fas fa-star" onClick={this.removeFromFavourites}></i>
              ) : (
                <i className="far fa-star" onClick={this.addToFavourites}>
                  {userLoggedIn ? null : (
                    <small>Log in to save the recipe.</small>
                  )}
                </i>
              )}
            </h3>{" "}
            <img
              alt={recipe.title}
              src={recipe.image}
              width="100"
              height="100"
            />
            <div>{recipe.instructions}</div>
          </div>
        )}
      </div>
    );
  }
}
