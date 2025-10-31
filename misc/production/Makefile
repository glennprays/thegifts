NAMESPACE ?= jia

update-image:
	@echo "Updating thegifts image in namespace $(NAMESPACE)..."
	kubectl set image deployment/thegifts thegifts=jiadocker777/bold-plastic:latest -n $(NAMESPACE) --record
	kubectl rollout restart deployment/thegifts -n $(NAMESPACE)
	kubectl rollout status deployment/thegifts -n $(NAMESPACE)
	@echo "Image updated successfully..."
