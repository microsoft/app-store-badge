import { v4 as uuidv4 } from "uuid";
/**
 * PSI service class which helps perform the default product acquisition method by calling the service endpoint
 * and fetching an installer template for the user to receive back on the client-side and install the product.
 */
// Perform PSI acquisition flow using download URL, send error if invalid response
export async function performPSIAcquisition(productId, productName, options = {}, url) {
    const psiServiceFailedOcidPrefix = "psi_f_svc";
    const cid = uuidv4();
    // Set up request
    const defaultOptions = {
        method: "GET",
        headers: {
            // Origin and referer overwritten by browser
            "Origin": "https://apps.microsoft.com",
            "Referer": document.URL,
            "Access-Control-Request-Method": "GET",
            "X-Correlation-Id": cid,
            "Content-Type": "application/octet-stream"
        },
        cache: "no-cache", // Don't cache locally, need to request new template from server
        params: new URLSearchParams(url)
    };
    const mergedOptions = { ...defaultOptions, ...options };
    // Attempt to fetch response from url
    let response = null;
    try {
        response = await fetch(`${url}`, mergedOptions);
    }
    catch (error) {
        window.location.href = `ms-windows-store://pdp/?productid=${productId}&ocid=${psiServiceFailedOcidPrefix}na`; // Redirect to fallback mode
    }
    // Parse response
    if (response === null || response === void 0 ? void 0 : response.ok) {
        getDownload(response); // If response ok, get blob installer template
    }
    else {
        onResponseError(response); // If response not ok, log error and redirect
    }
    // Helper method to retrieve installer template from response
    async function getDownload(response) {
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = `${productName} Installer.exe`; // Default file name
        if (contentDisposition) {
            const match = contentDisposition === null || contentDisposition === void 0 ? void 0 : contentDisposition.match(/filename\*=UTF-8''([\w%]*)/i);
            if (match && match[1]) {
                filename = match[1];
            }
        }
        const data = await response.blob();
        const fileURL = URL.createObjectURL(data);
        // Create a hidden link element and initiate the download
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = decodeURIComponent(filename);
        link.style.display = "none";
        document.body.appendChild(link);
        try {
            // Initiate the download
            link.click();
            // Wait for the download to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        catch (error) {
        }
        finally {
            // Safely clean up the object URL and the link element
            URL.revokeObjectURL(fileURL);
            document.body.removeChild(link);
        }
    }
    // Helper method to log error from response
    async function onResponseError(response) {
        const status = response === null || response === void 0 ? void 0 : response.status;
        window.location.href = `ms-windows-store://pdp/?productid=${productId}&ocid=${psiServiceFailedOcidPrefix}${status}`; // Fallback to full PDP
    }
}
//# sourceMappingURL=psi-service.js.map