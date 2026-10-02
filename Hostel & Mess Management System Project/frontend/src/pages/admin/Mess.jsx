import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Mess = () => {
    const [menu, setMenu] = useState([]);

    const [menuDate, setMenuDate] = useState("");
    const [mealType, setMealType] = useState("");
    const [foodItems, setFoodItems] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // FETCH MENU
    // =========================================

    const fetchMenu = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await adminService.getMenu();

            // Support the existing backend response
            // whether the array is returned as
            // "menu" or "menus".
            setMenu(
                data.menu ||
                data.menus ||
                []
            );

        } catch (error) {

            console.error(
                "Failed to fetch mess menu:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load mess menu"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMenu();
    }, []);


    // =========================================
    // CREATE MENU
    // =========================================

    const handleCreateMenu = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !menuDate ||
            !mealType ||
            !foodItems.trim()
        ) {
            setError(
                "Date, meal type and food items are required"
            );

            return;
        }

        try {

            setCreating(true);

            const data =
                await adminService.createMenu(
                    menuDate,
                    mealType,
                    foodItems
                );

            setSuccess(
                data.message
            );

            setMenuDate("");
            setMealType("");
            setFoodItems("");

            await fetchMenu();

        } catch (error) {

            console.error(
                "Failed to create menu:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create menu"
            );

        } finally {
            setCreating(false);
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading mess menu...
                    </h2>

                </main>

            </div>
        );
    }


    // =========================================
    // PAGE
    // =========================================

    return (
        <div className="student-layout">

            <AdminSidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>
                        Mess
                    </h1>

                    <p>
                        Manage the hostel mess
                        menu.
                    </p>

                </div>


                {/* ================================= */}
                {/* CREATE MENU */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Add Menu
                    </h2>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <form
                        className="complaint-form"
                        onSubmit={
                            handleCreateMenu
                        }
                    >

                        <div className="form-group">

                            <label>
                                Date
                            </label>

                            <input
                                type="date"
                                value={menuDate}
                                onChange={(event) =>
                                    setMenuDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Meal Type
                            </label>

                            <select
                                value={mealType}
                                onChange={(event) =>
                                    setMealType(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Meal
                                </option>

                                <option value="breakfast">
                                    Breakfast
                                </option>

                                <option value="lunch">
                                    Lunch
                                </option>

                                <option value="snacks">
                                    Snacks
                                </option>

                                <option value="dinner">
                                    Dinner
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Food Items
                            </label>

                            <textarea
                                rows="4"
                                value={foodItems}
                                onChange={(event) =>
                                    setFoodItems(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Rice, Dal, Vegetable Curry, Curd"
                            />

                        </div>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={creating}
                        >
                            {creating
                                ? "Adding..."
                                : "Add Menu"}
                        </button>

                    </form>

                </section>


                {/* ================================= */}
                {/* MENU LIST */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Menu List
                    </h2>

                    {menu.length === 0 ? (

                        <p>
                            No menu entries found.
                        </p>

                    ) : (

                        <div className="table-container">

                            <table className="data-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Meal
                                        </th>

                                        <th>
                                            Food Items
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {menu.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        item.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        item.menu_date
                                                    }
                                                </td>

                                                <td>

                                                    <span className="meal-badge">
                                                        {
                                                            item.meal_type
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        item.food_items
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default Mess;