export const getData = async <T>(url:string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`request failed with status ${response.status}`);
    }
    return await response.json();
}