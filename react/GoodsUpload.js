import React, {useEffect, useState} from "react";
import PreviousPage from "../../components/return/PreviousPage";
import {AihoButton} from "../../components/input/AihoButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Input, Switch, TextField, Typography} from "@mui/material";
import GoodService from "../../request/Goods/goodService";
import {useNavigate} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {currentProject} from "../../features/project/projectSlice";

export function GoodsUpload() {

    const [loading, setLoading] = React.useState(false);

    const [errors, setErrors] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const project = useSelector(currentProject);
    const navigate = useNavigate();


    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(event.target.files[0].name);
    };

    const handleSubmitButton = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        GoodService.uploadGoods(formData, project).then((response) => {
            NotificationManager.success('Успешно', 'Товары загружен')
            navigate("/goods");
        }).catch(error => {
            NotificationManager.error('Не удалось загрузить товары');
            console.log(error.response.data.errors.file[0]);
            setErrors(error.response.data.errors.file[0]);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <PreviousPage text="Загрузка: Товары"/>
            <InputLabel className="mb-2">Загрузите файл с товарами в формате .xlsx</InputLabel>
            <FormControl className="mb-3">
                <Input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileSelect}
                    style={{display: 'none'}}
                    id="file-input"
                />
                <label htmlFor="file-input">
                    <Button variant="contained" component="span">
                        Выберите файл
                    </Button>
                </label>
                {errors && (
                    <Typography variant="body2" color="error">
                        {errors}
                    </Typography>
                )}
            </FormControl>

            {selectedFile !== null && selectedFile !== undefined && (
                <Typography variant="h6" className="list-header">Выбранный файл: {fileName}</Typography>
            )}

            <AihoButton label="Загрузить"
                        loadingLabel="Загрузка"
                        onClick={handleSubmitButton}
                        isLoading={false}
                        classCss="button-color"
                        disabled={!selectedFile}
            />
        </div>
    )
}