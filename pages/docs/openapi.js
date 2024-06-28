'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function OpenApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    const fetchSpec = async () => {
      const response = await fetch('/api/v1/openapi');
      const data = await response.json();
      setSpec(data);
    };

    fetchSpec();
  }, []);

  if (!spec) {
    return <div>Loading...</div>;
  }

  return <SwaggerUI spec={spec} displayOperationId={true} />;
}