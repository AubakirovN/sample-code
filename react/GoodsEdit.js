import React, {useEffect} from "react";
import PreviousPage from "../../components/return/PreviousPage";
import {AihoButton} from "../../components/input/AihoButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {FormHelperText, Switch, TextField} from "@mui/material";
import {redirect} from "react-router";
import FormControlLabel from "@mui/material/FormControlLabel";
import GoodService from "../../request/Goods/goodService";
import {useLocation, useNavigate} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CategoryService from "../../request/Category/CategoryService";
import {useSelector} from "react-redux";
import {currentProject} from "../../features/project/projectSlice";

export function GoodsEdit() {
    const location = useLocation();
    const row = location.state?.row;
    const [name, setName] = React.useState(row.name);
    const [barcode, setBarcode] = React.useState(row.barcode);
    const [brand, setBrand] = React.useState(row.brand);
    const [imageUrl, setImageUrl] = React.useState(row.image_url);
    const [categoryId, setCategoryId] = React.useState(row.category_id);
    const [errors, setErrors] = React.useState({});
    const [categories, setCategories] = React.useState([]);
    const project = useSelector(currentProject);

    const navigate = useNavigate();

    useEffect(() => {
        getCategories()
    }, []);
    const handleChangeName = (e) => {
        const {value} = e.target;
        setName(value);
    }

    const handleChangeBarcode = (e) => {
        const {value} = e.target;
        setBarcode(value);
    }

    const handleChangeBrand = (e) => {
        const {value} = e.target;
        setBrand(value);
    }

    const handleChangeImage = (e) => {
        const {value} = e.target;
        setImageUrl(value);
    }

    const handleChangeCategory = (e) => {
        const {value} = e.target;
        setCategoryId(value);
    }

    const getCategories = () => {
        CategoryService.getCategories()
            .then((r) => {
                setCategories(r.data.data)
            });
    }

    const handleSubmitButton = () => {
        const data = {
            name: name,
            barcode: barcode,
            brand: brand,
            image_url: imageUrl,
            category_id: parseInt(categoryId),
        }

        GoodService.updateGood(row.id, data, project).then((response) => {
            NotificationManager.success('Успешно', 'Товар обновлен')
            return navigate("/goods");
        }).catch(error => {
            NotificationManager.error('Не удалось обновить товар');
            setErrors(error.response.data.Errors);
        });
    }

    return (
        <div>
            <PreviousPage text="Редактирование: Товар"/>

            <InputLabel className="mb-2">Баркод</InputLabel>
            <FormControl className="mb-3" fullWidth>
                <TextField
                    error={errors?.barcode}
                    helperText={errors?.barcode}
                    id="demo-simple-select"
                    type="number"
                    onChange={handleChangeBarcode}
                    InputLabelProps={{shrink: true}}
                    value={barcode}
                    size="small"
                />
            </FormControl>

            <InputLabel className="mb-2">Бренд</InputLabel>
            <FormControl className="mb-3" fullWidth>
                <TextField
                    error={errors?.brand}
                    helperText={errors?.brand}
                    id="demo-simple-select"
                    onChange={handleChangeBrand}
                    InputLabelProps={{shrink: true}}
                    inputProps={{
                        step: "0.01"
                    }}
                    value={brand}
                    size="small"
                />
            </FormControl>

            <InputLabel className="mb-2">Название</InputLabel>
            <FormControl className="mb-3" fullWidth>
                <TextField
                    error={errors?.name}
                    helperText={errors?.name}
                    id="demo-simple-select"
                    onChange={handleChangeName}
                    InputLabelProps={{shrink: true}}
                    value={name}
                    size="small"
                />
            </FormControl>

            <InputLabel className="mb-2">Ссылка на изображение</InputLabel>
            <FormControl className="mb-3" fullWidth>
                <TextField
                    error={errors?.image_url}
                    helperText={errors?.image_url}
                    id="demo-simple-select"
                    onChange={handleChangeImage}
                    InputLabelProps={{shrink: true}}
                    inputProps={{
                        step: "0.01"
                    }}
                    value={imageUrl}
                    size="small"
                />
            </FormControl>

            <InputLabel className="mb-2">Категория</InputLabel>
            <FormControl className="mb-3" fullWidth>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={categoryId}
                    label="Город"
                    onChange={handleChangeCategory}
                    size="small"
                >
                    {categories && categories.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            <AihoButton label="Сохранить" loadingLabel="Загрузка" onClick={handleSubmitButton} isLoading={false}
                        classCss="button-color"/>
        </div>
    )
}