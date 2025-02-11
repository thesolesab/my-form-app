"use client";

import { useCallback, useEffect, useState } from 'react';
import Input from './ui/input';
import Textarea from './ui/textarea';


var base_url = 'https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask?token='

const Form = () => {
    const [formState, setFormState] = useState({
        token: '',
        title: '',
        description: '',
        tags: [],
        budgetFrom: '',
        budgetTo: '',
        deadline: '',
        reminds: '',
        allAutoResponses: false,
        rules: {
            budget_from: '',
            budget_to: '',
            deadline_days: '',
            qty_freelancers: ''
        },
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('task_token');
        if (savedToken) {
            setFormState((prev) => ({ ...prev, token: savedToken }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { token, title, description, tags, budgetFrom, budgetTo, deadline, reminds, allAutoResponses, rules } = formState;

        const url = `${base_url}${encodeURIComponent(token)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&tags=${encodeURIComponent(tags)}&budget_from=${budgetFrom}&budget_to=${budgetTo}&deadline=${deadline}&reminds=${reminds}&all_auto_responses=${allAutoResponses}&rules=${encodeURIComponent(JSON.stringify(rules))}`

        const response = await fetch(
            url,
            {
                method: 'GET',
            }
        );

        if (response.status === 200) {
            alert('Задача опубликована');
        } else {
            alert('Ошибка при публикации задачи');
        }
    };


    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'token') {
            localStorage.setItem('task_token', value);
        }

        // Проверка на отрицательное число для полей типа 'number'
        if (type === 'number' && value < 0) {
            return;
        }
        console.log(checked);


        // Преобразование value в число, если это возможно
        const parsedValue = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;

        setFormState((prev) => {
            if (name.startsWith('rules.')) {
                const ruleKey = name.split('.')[1];
                return {
                    ...prev,
                    rules: {
                        ...prev.rules,
                        [ruleKey]: parsedValue,
                    },
                };
            }

            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : name === 'tags' ? value.split(',').map(el => el.trim()) : parsedValue,
            };
        });
    }, []);
    console.log('render form');

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                placeholder="Токен"
                name="token"
                value={formState.token}
                onChange={handleChange}
            />
            <Input
                type="text"
                placeholder="Заголовок"
                name="title"
                value={formState.title}
                onChange={handleChange}
            />
            <Textarea
                placeholder="Описание"
                name="description"
                value={formState.description}
                onChange={handleChange}
            />
            <Input
                type="text"
                placeholder="Теги (через запятую)"
                name="tags"
                value={formState.tags.join(', ')}
                onChange={handleChange}
            />
            <Input
                placeholder="Бюджет от"
                name="budgetFrom"
                value={formState.budgetFrom}
                onChange={handleChange}
            />
            <Input
                placeholder="Бюджет до"
                name="budgetTo"
                value={formState.budgetTo}
                onChange={handleChange}
            />
            <Input
                placeholder="Дедлайн (дни)"
                name="deadline"
                value={formState.deadline}
                onChange={handleChange}
            />
            <Input
                placeholder="Напоминания"
                name="reminds"
                value={formState.reminds}
                onChange={handleChange}
            />
            <label className="flex items-center space-x-2">
                <Input
                    type="checkbox"
                    name="allAutoResponses"
                    checked={formState.allAutoResponses}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <span>Все автоматические ответы</span>
            </label>
            <p>Правила:</p>
            <Input
                placeholder="Бюджет от"
                name="rules.budget_from"
                value={formState.rules.budget_from}
                onChange={handleChange}
            />
            <Input
                placeholder="Бюджет до"
                name="rules.budget_to"
                value={formState.rules.budget_to}
                onChange={handleChange}
            />
            <Input
                placeholder="Срок выполнения"
                name="rules.deadline_days"
                value={formState.rules.deadline_days}
                onChange={handleChange}
            />
            <Input
                placeholder="Количество фрилансеров"
                name="rules.qty_freelancers"
                value={formState.rules.qty_freelancers}
                onChange={handleChange}
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Опубликовать задачу
            </button>
        </form>
    );
}

export default Form