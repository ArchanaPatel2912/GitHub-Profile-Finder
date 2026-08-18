/* =========================================
   GITHUB PROFILE FINDER
   Fetch API + Async/Await + JSON
========================================= */


// =========================================
// GitHub API
// =========================================

const API_URL =
    "https://api.github.com/users/";


// =========================================
// Get HTML Elements
// =========================================

const usernameInput =
    document.getElementById("username");

const searchBtn =
    document.getElementById("searchBtn");

const loader =
    document.getElementById("loader");

const errorBox =
    document.getElementById("error");

const profileCard =
    document.getElementById("profile");

const repositories =
    document.getElementById("repositories");

const repoList =
    document.getElementById("repoList");


// =========================================
// Search Button
// =========================================

searchBtn.addEventListener(
    "click",
    searchUser
);


// =========================================
// Enter Key
// =========================================

usernameInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            searchUser();

        }

    }
);


// =========================================
// SEARCH USER
// =========================================

async function searchUser() {


    // Get username

    const username =
        usernameInput.value.trim();


    // Check empty input

    if (username === "") {

        showError(
            "Please enter a GitHub username."
        );

        return;

    }


    // Hide old results

    profileCard.classList.remove(
        "show"
    );

    repositories.classList.remove(
        "show"
    );

    errorBox.classList.remove(
        "show"
    );


    // Show loading

    loader.classList.add(
        "show"
    );


    try {


        // =====================================
        // FETCH GITHUB API
        // =====================================

        const response = await fetch(

            API_URL +
            encodeURIComponent(username)

        );


        // Check API response

        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "GitHub user not found."
                );

            }


            throw new Error(
                "Unable to fetch GitHub data."
            );

        }


        // =====================================
        // CONVERT RESPONSE TO JSON
        // =====================================

        const userData =
            await response.json();


        // =====================================
        // DISPLAY USER
        // =====================================

        displayUser(userData);


        // =====================================
        // GET REPOSITORIES
        // =====================================

        await getRepositories(
            username
        );


    }

    catch (error) {

        console.error(
            "Error:",
            error
        );

        showError(
            error.message
        );

    }

    finally {

        // Hide loading

        loader.classList.remove(
            "show"
        );

    }

}



// =========================================
// DISPLAY USER DATA
// =========================================

function displayUser(user) {


    // Profile image

    document.getElementById(
        "avatar"
    ).src =
        user.avatar_url;


    // Name

    document.getElementById(
        "name"
    ).textContent =
        user.name ||
        user.login;


    // Username

    document.getElementById(
        "login"
    ).textContent =
        "@" + user.login;


    // Bio

    document.getElementById(
        "bio"
    ).textContent =
        user.bio ||
        "No bio available.";


    // Location

    document.getElementById(
        "location"
    ).textContent =
        user.location ||
        "Not available";


    // Company

    document.getElementById(
        "company"
    ).textContent =
        user.company ||
        "Not available";


    // =====================================
    // Account Creation Date
    // =====================================

    const joinedDate =
        new Date(
            user.created_at
        );


    document.getElementById(
        "joined"
    ).textContent =
        joinedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );


    // =====================================
    // Website
    // =====================================

    const website =
        document.getElementById(
            "website"
        );


    if (user.blog) {

        website.innerHTML = `

            <a
                href="${user.blog}"
                target="_blank"
            >
                ${user.blog}
            </a>

        `;

    }

    else {

        website.textContent =
            "Not available";

    }


    // =====================================
    // Statistics
    // =====================================

    document.getElementById(
        "repos"
    ).textContent =
        user.public_repos;


    document.getElementById(
        "followers"
    ).textContent =
        user.followers;


    document.getElementById(
        "following"
    ).textContent =
        user.following;


    // =====================================
    // GitHub Profile Link
    // =====================================

    document.getElementById(
        "profileLink"
    ).href =
        user.html_url;


    // Show profile card

    profileCard.classList.add(
        "show"
    );

}



// =========================================
// GET REPOSITORIES
// =========================================

async function getRepositories(
    username
) {


    const response = await fetch(

        API_URL +

        encodeURIComponent(
            username
        ) +

        "/repos?sort=updated&per_page=6"

    );


    if (!response.ok) {

        throw new Error(
            "Unable to fetch repositories."
        );

    }


    // =====================================
    // JSON RESPONSE
    // =====================================

    const repos =
        await response.json();


    // Display repositories

    displayRepositories(
        repos
    );

}



// =========================================
// DISPLAY REPOSITORIES
// =========================================

function displayRepositories(
    repos
) {


    repoList.innerHTML = "";


    // No repositories

    if (repos.length === 0) {

        repoList.innerHTML = `

            <p>
                No public repositories found.
            </p>

        `;

        repositories.classList.add(
            "show"
        );

        return;

    }


    // =====================================
    // Loop through JSON data
    // =====================================

    repos.forEach(
        function (repo, index) {


            const repoCard =
                document.createElement(
                    "div"
                );


            repoCard.className =
                "repo";


            // Animation delay

            repoCard.style.animationDelay =
                `${index * 0.1}s`;


            // =================================
            // Insert repository JSON data
            // =================================

            repoCard.innerHTML = `

                <h3>
                    ${repo.name}
                </h3>


                <p>
                    ${
                        repo.description ||
                        "No description available."
                    }
                </p>


                <div class="repo-info">

                    <span>
                        ⭐
                        ${repo.stargazers_count}
                    </span>


                    <span>
                        🍴
                        ${repo.forks_count}
                    </span>


                    <span>
                        💻
                        ${
                            repo.language ||
                            "N/A"
                        }
                    </span>

                </div>

            `;


            // Open repository

            repoCard.addEventListener(
                "click",
                function () {

                    window.open(
                        repo.html_url,
                        "_blank"
                    );

                }
            );


            repoList.appendChild(
                repoCard
            );

        }
    );


    repositories.classList.add(
        "show"
    );

}



// =========================================
// ERROR MESSAGE
// =========================================

function showError(
    message
) {


    errorBox.textContent =
        "⚠️ " + message;


    errorBox.classList.add(
        "show"
    );


    profileCard.classList.remove(
        "show"
    );


    repositories.classList.remove(
        "show"
    );

}